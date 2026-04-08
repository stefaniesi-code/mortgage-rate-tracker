"""
Mortgage Rate Alert Backend  v2
Stack: Python + FastAPI + Resend + SQLite
Run:   pip install fastapi uvicorn resend httpx apscheduler python-dotenv --break-system-packages
       uvicorn main:app --reload
"""

import os
import sqlite3
import httpx
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from asyncio import gather as asyncio_gather
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from dotenv import load_dotenv
import resend

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL     = os.getenv("FROM_EMAIL", "onboarding@resend.dev")
SITE_NAME      = "Mortgage Rate Tracker"
DB_PATH        = "subscribers.db"
FRED_API_KEY   = "5a5740f7a77aa3024c57da29a49f6960"  # free public demo key

resend.api_key = RESEND_API_KEY

# ── Database ──────────────────────────────────────────────────────────────────
def init_db():
    con = sqlite3.connect(DB_PATH)
    con.execute("""
        CREATE TABLE IF NOT EXISTS subscribers (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            email     TEXT NOT NULL UNIQUE,
            threshold REAL NOT NULL,
            weekly    INTEGER DEFAULT 1,
            big_move  INTEGER DEFAULT 1,
            active    INTEGER DEFAULT 1,
            created   TEXT DEFAULT (datetime('now'))
        )
    """)
    con.execute("""
        CREATE TABLE IF NOT EXISTS rate_log (
            date    TEXT PRIMARY KEY,
            r30     REAL,
            r15     REAL,
            arm     REAL,
            source  TEXT DEFAULT 'FRED',
            fetched TEXT DEFAULT (datetime('now'))
        )
    """)
    con.commit()
    con.close()

def get_db():
    return sqlite3.connect(DB_PATH)

def save_rate(rate: dict):
    con = get_db()
    con.execute(
        "INSERT OR REPLACE INTO rate_log (date, r30, r15, arm, source) VALUES (?,?,?,?,?)",
        (rate["date"], rate["r30"], rate["r15"],
         rate.get("arm", round(rate["r30"] - 0.52, 2)),
         rate.get("source", "FRED"))
    )
    con.commit()
    con.close()

# ── FRED API ──────────────────────────────────────────────────────────────────
async def fetch_fred_series(series_id: str, limit: int = 260) -> list[dict]:
    """Fetch a FRED series. Returns [{date, value}] sorted ascending."""
    url = "https://api.stlouisfed.org/fred/series/observations"
    params = {
        "series_id":  series_id,
        "api_key":    FRED_API_KEY,
        "file_type":  "json",
        "sort_order": "desc",
        "limit":      limit,
    }
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        obs = r.json().get("observations", [])
        result = [
            {"date": o["date"], "value": round(float(o["value"]), 2)}
            for o in obs if o["value"] not in (".", None, "")
        ]
        return list(reversed(result))  # ascending

async def fetch_mnd_rate() -> dict | None:
    """Scrape MND daily rate index — updated ~4PM ET weekdays."""
    try:
        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
            r = await client.get(
                "https://www.mortgagenewsdaily.com/mortgage-rates",
                headers={"User-Agent": "Mozilla/5.0 (compatible; MortgageTracker/1.0)"}
            )
            text = r.text
            # MND embeds rate in a JSON-like structure or visible text
            # Look for pattern like "6.43" near "30 Yr"
            import re
            match = re.search(r'30 Yr[^0-9]*(\d+\.\d+)', text)
            if match:
                r30 = float(match.group(1))
                if 3.0 < r30 < 12.0:  # sanity check
                    today = datetime.today().strftime("%Y-%m-%d")
                    return {
                        "date":   today,
                        "r30":    r30,
                        "r15":    round(r30 - 0.69, 2),
                        "arm":    round(r30 - 0.31, 2),
                        "source": "MND",
                    }
    except Exception as e:
        print(f"[MND scrape error] {e}")
    return None

async def fetch_current_rate() -> dict:
    """Try MND first (daily), fall back to FRED (weekly), then DB cache."""
    # 1. Try MND — most current daily rate
    mnd = await fetch_mnd_rate()
    if mnd:
        print(f"[MND] {mnd['date']}: {mnd['r30']}%")
        return mnd

    # 2. Fall back to FRED weekly
    try:
        r30_data, r15_data = await asyncio_gather(
            fetch_fred_series("MORTGAGE30US", 2),
            fetch_fred_series("MORTGAGE15US", 2),
        )
        r30 = r30_data[-1]
        r15 = r15_data[-1]
        return {
            "date":   r30["date"],
            "r30":    r30["value"],
            "r15":    r15["value"],
            "arm":    round(r30["value"] - 0.52, 2),
            "source": "FRED/Freddie Mac",
        }
    except Exception as e:
        print(f"[FRED fetch error] {e}")
        con = get_db()
        row = con.execute(
            "SELECT r30, r15, arm, date FROM rate_log ORDER BY date DESC LIMIT 1"
        ).fetchone()
        con.close()
        if row:
            return {"r30": row[0], "r15": row[1], "arm": row[2],
                    "date": row[3], "source": "cached"}
        return {"r30": 6.47, "r15": 5.76, "arm": 5.95,
                "date": str(datetime.today().date()), "source": "default"}

async def seed_history_if_empty():
    """On first boot, seed DB with 2yr of FRED history."""
    con = get_db()
    count = con.execute("SELECT COUNT(*) FROM rate_log").fetchone()[0]
    con.close()
    if count >= 100:
        print(f"[seed] DB has {count} rows, skipping seed")
        return
    print(f"[seed] DB has only {count} rows — fetching 2yr history from FRED...")
    try:
        r30_data, r15_data = await asyncio_gather(
            fetch_fred_series("MORTGAGE30US", 104),
            fetch_fred_series("MORTGAGE15US", 104),
        )
        r15_map = {x["date"]: x["value"] for x in r15_data}
        for item in r30_data:
            save_rate({
                "date":   item["date"],
                "r30":    item["value"],
                "r15":    r15_map.get(item["date"], round(item["value"] - 0.71, 2)),
                "arm":    round(item["value"] - 0.52, 2),
                "source": "FRED/seed",
            })
        print(f"[seed] Done — {len(r30_data)} weeks loaded")
    except Exception as e:
        print(f"[seed error] {e}")

# ── Technical Indicators ──────────────────────────────────────────────────────
def sma(data: list[float], period: int) -> list:
    return [
        round(sum(data[i-period:i]) / period, 4) if i >= period else None
        for i in range(1, len(data)+1)
    ]

def bollinger_bands(data: list[float], period: int = 20, k: float = 2.0):
    upper, lower = [], []
    for i in range(len(data)):
        if i < period:
            upper.append(None); lower.append(None)
        else:
            window = data[i-period:i]
            mid = sum(window) / period
            std = (sum((x - mid)**2 for x in window) / period) ** 0.5
            upper.append(round(mid + k * std, 4))
            lower.append(round(mid - k * std, 4))
    return upper, lower

def rsi(data: list[float], period: int = 14) -> list:
    result = [None] * period
    for i in range(period, len(data)):
        window = data[i-period:i+1]
        deltas = [window[j+1] - window[j] for j in range(len(window)-1)]
        gains  = [max(d, 0) for d in deltas]
        losses = [max(-d, 0) for d in deltas]
        avg_gain = sum(gains) / period
        avg_loss = sum(losses) / period or 0.0001
        rs = avg_gain / avg_loss
        result.append(round(100 - 100 / (1 + rs), 2))
    return result

def compute_signal(r30: list[float], ma7: list, ma30: list, rsi14: list) -> dict:
    """MA crossover + RSI → bullish / bearish / neutral with plain-English reason."""
    if len(r30) < 30:
        return {"signal": "neutral", "reason": "Insufficient data"}

    last_ma7  = next((x for x in reversed(ma7)  if x is not None), None)
    last_ma30 = next((x for x in reversed(ma30) if x is not None), None)
    last_rsi  = next((x for x in reversed(rsi14) if x is not None), None)

    if None in (last_ma7, last_ma30, last_rsi):
        return {"signal": "neutral", "reason": "Calculating indicators..."}

    ma_bullish = last_ma7 < last_ma30  # 7d below 30d = short-term lower = falling
    rsi_val    = last_rsi

    if ma_bullish and rsi_val < 50:
        signal = "bullish"
        reason = (f"7-day MA ({last_ma7:.2f}%) is below the 30-day MA ({last_ma30:.2f}%), "
                  f"signaling short-term rate decline. RSI at {rsi_val:.0f} confirms "
                  f"downward momentum without being oversold.")
    elif not ma_bullish and rsi_val > 50:
        signal = "bearish"
        reason = (f"7-day MA ({last_ma7:.2f}%) crossed above 30-day MA ({last_ma30:.2f}%), "
                  f"signaling upward rate pressure. RSI at {rsi_val:.0f} suggests "
                  f"momentum is still building.")
    elif rsi_val < 35:
        signal = "bullish"
        reason = (f"RSI at {rsi_val:.0f} — rates are in oversold territory. "
                  f"A stabilization or mild bounce is likely in the near term.")
    elif rsi_val > 65:
        signal = "bearish"
        reason = (f"RSI at {rsi_val:.0f} — rates are overbought. "
                  f"Upward momentum may slow or reverse soon.")
    else:
        signal = "neutral"
        reason = (f"7-day MA ({last_ma7:.2f}%) and 30-day MA ({last_ma30:.2f}%) are close, "
                  f"RSI at {rsi_val:.0f}. No clear directional signal — market is consolidating.")

    return {
        "signal":    signal,
        "reason":    reason,
        "ma7_last":  last_ma7,
        "ma30_last": last_ma30,
        "rsi_last":  last_rsi,
    }

# ── Helpers ───────────────────────────────────────────────────────────────────
def _monthly(rate: float, loan: float) -> float:
    r, n = rate / 100 / 12, 360
    return loan * r * (1+r)**n / ((1+r)**n - 1) if r > 0 else loan / n

# ── Scheduler Jobs ────────────────────────────────────────────────────────────
async def job_check_rates():
    """Weekdays 5:05PM ET — fetch latest rate, save, check alerts."""
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] Daily rate check...")
    rate = await fetch_current_rate()
    save_rate(rate)
    r30 = rate["r30"]

    con = get_db()
    subs = con.execute(
        "SELECT email, threshold, big_move FROM subscribers WHERE active=1"
    ).fetchall()
    rows = con.execute(
        "SELECT r30 FROM rate_log ORDER BY date DESC LIMIT 2"
    ).fetchall()
    prev = rows[1][0] if len(rows) >= 2 else r30
    con.close()

    for email, threshold, big_move in subs:
        if r30 <= threshold:
            try:
                resend.Emails.send({
                    "from": FROM_EMAIL, "to": email,
                    "subject": f"🔔 Rate Alert: 30yr dropped to {r30:.2f}%",
                    "html": f"<p>30yr rate is now <strong>{r30:.2f}%</strong>, below your alert of {threshold:.2f}%. Est. monthly savings on $500K: ${_monthly(r30,400000)-_monthly(threshold,400000):.0f}.</p><p style='font-size:12px;color:#64748b'>Rates from Freddie Mac PMMS · For informational use only.</p>"
                })
                print(f"  ✅ Alert → {email}")
            except Exception as e:
                print(f"  ❌ {email}: {e}")

        if big_move and abs(r30 - prev) >= 0.15:
            try:
                direction = "dropped" if r30 < prev else "jumped"
                resend.Emails.send({
                    "from": FROM_EMAIL, "to": email,
                    "subject": f"⚡ Rates {direction} {abs(r30-prev):.2f}% today",
                    "html": f"<p>30yr fixed rate {direction} <strong>{abs(r30-prev):.2f}%</strong> to <strong>{r30:.2f}%</strong> today.</p>"
                })
                print(f"  ⚡ Big move → {email}")
            except Exception as e:
                print(f"  ❌ {email}: {e}")

    print(f"  Rate: {r30}% · {len(subs)} subscribers checked")

async def job_weekly_summary():
    """Mondays 8AM ET — weekly digest email."""
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] Weekly summaries...")
    rate = await fetch_current_rate()
    con = get_db()
    rows = con.execute("SELECT r30 FROM rate_log ORDER BY date DESC LIMIT 6").fetchall()
    r30_wk = rows[-1][0] if rows else rate["r30"]
    subs = con.execute(
        "SELECT email FROM subscribers WHERE active=1 AND weekly=1"
    ).fetchall()
    con.close()
    change = rate["r30"] - r30_wk
    for (email,) in subs:
        try:
            resend.Emails.send({
                "from": FROM_EMAIL, "to": email,
                "subject": f"📊 Weekly Rates: 30yr at {rate['r30']:.2f}%",
                "html": f"""
                <p>This week's 30yr fixed: <strong>{rate['r30']:.2f}%</strong>
                ({'▲' if change>0 else '▼'} {abs(change):.2f}% vs last week)</p>
                <table style='width:100%;font-size:13px;border-collapse:collapse'>
                  <tr style='background:#f1f5f9'><th style='padding:8px;text-align:left'>Loan</th><th style='padding:8px;text-align:right'>Monthly P&I</th></tr>
                  {''.join(f"<tr><td style='padding:8px'>${l:,} (20% down)</td><td style='padding:8px;text-align:right'>${_monthly(rate['r30'],l*.8):,.0f}</td></tr>" for l in [400000,600000,800000])}
                </table>
                <p style='font-size:11px;color:#64748b;margin-top:12px'>For informational purposes only · <a href='https://yourdomain.com/unsubscribe?email={email}'>Unsubscribe</a></p>
                """
            })
            print(f"  📊 Weekly → {email}")
        except Exception as e:
            print(f"  ❌ {email}: {e}")

# ── FastAPI App ───────────────────────────────────────────────────────────────
scheduler = AsyncIOScheduler(timezone="America/New_York")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    await seed_history_if_empty()
    scheduler.add_job(job_check_rates,    "cron", day_of_week="mon-fri", hour=17, minute=5)
    scheduler.add_job(job_weekly_summary, "cron", day_of_week="mon",     hour=8,  minute=0)
    scheduler.start()
    print("✅ Mortgage Rate API ready — rate check weekdays 5:05PM ET")
    yield
    scheduler.shutdown()

app = FastAPI(title="Mortgage Rate Tracker API", version="2.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class SubscribeRequest(BaseModel):
    email:     str
    threshold: float
    weekly:    bool = True
    big_move:  bool = True

# ── API Routes ────────────────────────────────────────────────────────────────

@app.get("/api/rates/today")
async def rates_today():
    """Latest rate — called by frontend on every page load."""
    rate = await fetch_current_rate()
    save_rate(rate)
    return rate

@app.get("/api/rates/chart")
async def rates_chart(days: int = 90):
    """
    Historical rates + technical indicators for the chart.
    Frontend calls: /api/rates/chart?days=90
    Returns: { dates, r30, r15, ma7, ma30, bb_upper, bb_lower, rsi14, signal }
    """
    con = get_db()
    cutoff = (datetime.today() - timedelta(days=days)).strftime("%Y-%m-%d")
    # Pull a bit more history so MA/RSI have enough warmup data
    warmup_cutoff = (datetime.today() - timedelta(days=days+60)).strftime("%Y-%m-%d")
    rows = con.execute(
        "SELECT date, r30, r15, arm FROM rate_log WHERE date >= ? ORDER BY date ASC",
        (warmup_cutoff,)
    ).fetchall()
    con.close()

    # If not enough data, seed from FRED
    if len(rows) < 30:
        await seed_history_if_empty()
        con = get_db()
        rows = con.execute(
            "SELECT date, r30, r15, arm FROM rate_log WHERE date >= ? ORDER BY date ASC",
            (warmup_cutoff,)
        ).fetchall()
        con.close()

    if not rows:
        return {"dates": [], "r30": [], "r15": [], "ma7": [], "ma30": [],
                "bb_upper": [], "bb_lower": [], "rsi14": [], "signal": {}}

    all_dates = [r[0] for r in rows]
    all_r30   = [r[1] for r in rows]
    all_r15   = [r[2] for r in rows]

    # Compute indicators on full warmup window
    ma7_full      = sma(all_r30, 7)
    ma30_full     = sma(all_r30, 30)
    bb_u_full, bb_l_full = bollinger_bands(all_r30, 20, 2)
    rsi_full      = rsi(all_r30, 14)
    signal        = compute_signal(all_r30, ma7_full, ma30_full, rsi_full)

    # Trim to requested window
    trim_start = next((i for i, d in enumerate(all_dates) if d >= cutoff), 0)
    return {
        "dates":    all_dates[trim_start:],
        "r30":      all_r30[trim_start:],
        "r15":      all_r15[trim_start:],
        "ma7":      ma7_full[trim_start:],
        "ma30":     ma30_full[trim_start:],
        "bb_upper": bb_u_full[trim_start:],
        "bb_lower": bb_l_full[trim_start:],
        "rsi14":    rsi_full[trim_start:],
        "signal":   signal,
    }

@app.get("/api/rates/history")
async def rate_history(days: int = 30):
    con = get_db()
    rows = con.execute(
        "SELECT date, r30, r15 FROM rate_log ORDER BY date DESC LIMIT ?", (days,)
    ).fetchall()
    con.close()
    return [{"date": r[0], "r30": r[1], "r15": r[2]} for r in rows]

@app.post("/api/subscribe")
async def subscribe(req: SubscribeRequest):
    con = get_db()
    existing = con.execute("SELECT id FROM subscribers WHERE email=?", (req.email,)).fetchone()
    if existing:
        con.execute(
            "UPDATE subscribers SET threshold=?, weekly=?, big_move=?, active=1 WHERE email=?",
            (req.threshold, int(req.weekly), int(req.big_move), req.email)
        )
    else:
        con.execute(
            "INSERT INTO subscribers (email, threshold, weekly, big_move) VALUES (?,?,?,?)",
            (req.email, req.threshold, int(req.weekly), int(req.big_move))
        )
    con.commit()
    con.close()
    try:
        resend.Emails.send({
            "from": FROM_EMAIL, "to": req.email,
            "subject": f"✅ Rate alert set below {req.threshold:.2f}%",
            "html": f"<p>You're subscribed! We'll email you when the 30yr rate drops below <strong>{req.threshold:.2f}%</strong>.</p>"
        })
    except Exception as e:
        print(f"Confirmation email error: {e}")
    return {"status": "ok", "message": f"Alert set for {req.email}"}

@app.get("/api/unsubscribe")
async def unsubscribe(email: str):
    con = get_db()
    con.execute("UPDATE subscribers SET active=0 WHERE email=?", (email,))
    con.commit()
    con.close()
    return {"status": "ok"}

@app.get("/api/subscribers/count")
async def subscriber_count():
    con = get_db()
    n = con.execute("SELECT COUNT(*) FROM subscribers WHERE active=1").fetchone()[0]
    con.close()
    return {"active": n}

# ── News ──────────────────────────────────────────────────────────────────────
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
NEWS_CACHE: dict = {}   # {date_str: [articles]}

RATE_UP_KEYWORDS = [
    "inflation","cpi higher","hot jobs","beats expectations","hawkish",
    "rate hike","yields rise","oil surge","economy strong","gdp beat",
    "tariff","war escalat","iran attack","fed holds","no cut","delay cut",
    "fewer cuts","strong payroll","wage growth",
]
RATE_DOWN_KEYWORDS = [
    "inflation cools","inflation falls","cpi lower","jobless","layoffs",
    "recession","slowdown","dovish","rate cut","fed cut","yields fall",
    "ceasefire","peace","de-escalat","weak jobs","below expectations",
    "gdp miss","unemployment rises","cooling","mortgage rates fall",
    "rates drop","rates ease","rates decline","treasury lower",
]

def score_impact(title: str) -> str:
    t = title.lower()
    up   = sum(1 for k in RATE_UP_KEYWORDS   if k in t)
    down = sum(1 for k in RATE_DOWN_KEYWORDS if k in t)
    if up > down:   return "up"
    if down > up:   return "down"
    return "neutral"

def impact_reason(title: str, impact: str) -> str:
    t = title.lower()
    if impact == "up":
        if "inflation" in t or "cpi" in t:
            return "Higher inflation → Fed stays hawkish → bond yields rise → mortgage rates up."
        if "job" in t or "employ" in t:
            return "Strong jobs data → economy resilient → Fed less likely to cut → rates stay elevated."
        if "fed" in t or "hawkish" in t:
            return "Fed hawkish stance → market prices in fewer cuts → long-term rates rise."
        if "tariff" in t or "war" in t or "iran" in t:
            return "Geopolitical risk / tariffs → inflation fear → bond sell-off → rates up."
        return "Bullish economic signal → reduces rate cut expectations → mortgage rates trend higher."
    if impact == "down":
        if "inflation" in t or "cpi" in t:
            return "Cooling inflation → Fed can cut sooner → bond rally → mortgage rates fall."
        if "job" in t or "unemploy" in t:
            return "Weak jobs → economic slowdown → Fed more likely to cut → rates ease."
        if "ceasefire" in t or "peace" in t or "de-escalat" in t:
            return "Geopolitical calm → risk-off unwind → bond prices rise → yields and rates fall."
        if "cut" in t or "dovish" in t:
            return "Fed dovish signal → market prices in more cuts → 10yr Treasury yields drop → rates follow."
        return "Bearish economic signal → increases cut expectations → mortgage rates trend lower."
    return "Mixed signals — no dominant rate driver identified in this headline."

async def fetch_news() -> list[dict]:
    """Fetch mortgage/Fed news from NewsAPI, cache by date."""
    today = datetime.today().strftime("%Y-%m-%d")
    if NEWS_CACHE.get("date") == today and NEWS_CACHE.get("articles"):
        return NEWS_CACHE["articles"]

    if not NEWS_API_KEY:
        return []

    articles = []
    queries = [
        ("mortgage rate 2026", "mortgage"),
        ("Federal Reserve interest rate", "fed"),
    ]
    async with httpx.AsyncClient(timeout=10) as client:
        for q, tag in queries:
            try:
                r = await client.get(
                    "https://newsapi.org/v2/everything",
                    params={
                        "q": q, "language": "en",
                        "sortBy": "publishedAt", "pageSize": 8,
                        "apiKey": NEWS_API_KEY,
                    }
                )
                for a in r.json().get("articles", []):
                    title = a.get("title","")
                    if not title or "[Removed]" in title:
                        continue
                    impact = score_impact(title)
                    articles.append({
                        "title":  title,
                        "source": a.get("source",{}).get("name",""),
                        "url":    a.get("url",""),
                        "date":   (a.get("publishedAt","") or "")[:10],
                        "tag":    tag,
                        "impact": impact,
                        "reason": impact_reason(title, impact),
                    })
            except Exception as e:
                print(f"[news fetch error] {e}")

    # Deduplicate
    seen, unique = set(), []
    for a in articles:
        if a["title"] not in seen:
            seen.add(a["title"])
            unique.append(a)

    NEWS_CACHE["date"]     = today
    NEWS_CACHE["articles"] = unique
    return unique

@app.get("/api/news")
async def get_news():
    """Return latest mortgage/Fed news with rate impact analysis."""
    articles = await fetch_news()
    if not articles:
        return {"articles": [], "signal": "neutral",
                "up": 0, "down": 0, "neutral": 0, "total": 0,
                "error": "No NEWS_API_KEY set or fetch failed"}

    total   = len(articles)
    up_n    = sum(1 for a in articles if a["impact"] == "up")
    down_n  = sum(1 for a in articles if a["impact"] == "down")
    neut_n  = total - up_n - down_n
    up_pct  = round(up_n   / total * 100)
    down_pct= round(down_n / total * 100)
    neut_pct= round(neut_n / total * 100)

    if down_pct > up_pct + 15:   overall = "down"
    elif up_pct > down_pct + 15: overall = "up"
    else:                         overall = "neutral"

    return {
        "articles": articles,
        "signal":   overall,
        "up":       up_pct,
        "down":     down_pct,
        "neutral":  neut_pct,
        "total":    total,
        "date":     datetime.today().strftime("%Y-%m-%d"),
    }

@app.get("/api/seed")
async def manual_seed():
    """Manually trigger history seed — call once to populate DB."""
    await seed_history_if_empty()
    con = get_db()
    count = con.execute("SELECT COUNT(*) FROM rate_log").fetchone()[0]
    con.close()
    return {"status": "ok", "rows": count}

@app.get("/")
async def root():
    return {"status": "ok", "message": "Mortgage Rate Tracker API v2",
            "endpoints": ["/api/rates/today", "/api/rates/chart", "/api/rates/history",
                          "/api/news", "/api/subscribe", "/api/unsubscribe"]}
