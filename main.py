"""
Mortgage Rate Alert Backend
Stack: Python + FastAPI + Resend + SQLite
Run:   pip install fastapi uvicorn resend httpx apscheduler --break-system-packages
       uvicorn main:app --reload
"""

import json
import sqlite3
import httpx
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import resend

# ── Config ────────────────────────────────────────────────────────────────────
RESEND_API_KEY  = "re_MKbLzXHB_7v2Ze19Nd8QJ1mpCJvzsvkgC"        # https://resend.com/api-keys
FROM_EMAIL      = "onboarding@resend.dev"
SITE_NAME       = "Mortgage Rate Tracker"
DB_PATH         = "subscribers.db"

resend.api_key = RESEND_API_KEY

# ── Database ──────────────────────────────────────────────────────────────────
def init_db():
    con = sqlite3.connect(DB_PATH)
    con.execute("""
        CREATE TABLE IF NOT EXISTS subscribers (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            email     TEXT NOT NULL,
            threshold REAL NOT NULL,
            weekly    INTEGER DEFAULT 1,
            big_move  INTEGER DEFAULT 1,
            active    INTEGER DEFAULT 1,
            created   TEXT DEFAULT (datetime('now')),
            notified  INTEGER DEFAULT 0
        )
    """)
    con.execute("""
        CREATE TABLE IF NOT EXISTS rate_log (
            date  TEXT PRIMARY KEY,
            r30   REAL,
            r15   REAL,
            arm   REAL,
            fetched TEXT DEFAULT (datetime('now'))
        )
    """)
    con.commit()
    con.close()

def get_db():
    return sqlite3.connect(DB_PATH)

# ── Fetch live rate from Freddie Mac / MND ─────────────────────────────────
async def fetch_current_rate() -> dict:
    """
    Primary:  FRED API (free, no key needed for public JSON endpoint)
    Fallback: last known rate from our DB
    """
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            # FRED public JSON endpoint — no API key required
            r = await client.get(
                "https://fred.stlouisfed.org/graph/fredgraph.json",
                params={"id": "MORTGAGE30US"}
            )
            rows = r.json()
            # Returns list of {date, value}
            valid = [x for x in rows if x.get("value") not in (".", None, "")]
            latest = valid[-1]
            return {
                "date": latest["date"],
                "r30":  float(latest["value"]),
                "r15":  float(latest["value"]) - 0.71,  # approx spread
                "source": "FRED/Freddie Mac"
            }
    except Exception as e:
        print(f"[rate fetch error] {e}")
        # Fallback: return last saved rate
        con = get_db()
        row = con.execute("SELECT r30, r15, date FROM rate_log ORDER BY date DESC LIMIT 1").fetchone()
        con.close()
        if row:
            return {"r30": row[0], "r15": row[1], "date": row[2], "source": "cached"}
        return {"r30": 6.47, "r15": 5.76, "date": str(datetime.today().date()), "source": "default"}

def save_rate(rate: dict):
    con = get_db()
    con.execute(
        "INSERT OR REPLACE INTO rate_log (date, r30, r15) VALUES (?, ?, ?)",
        (rate["date"], rate["r30"], rate["r15"])
    )
    con.commit()
    con.close()

# ── Email templates ───────────────────────────────────────────────────────────
def email_alert(email: str, threshold: float, current: float) -> None:
    saving_500k = _monthly(current, 500000) - _monthly(threshold, 500000)
    resend.Emails.send({
        "from":    FROM_EMAIL,
        "to":      email,
        "subject": f"🔔 Rate Alert: 30yr mortgage hit {current:.2f}%",
        "html": f"""
        <div style="font-family:sans-serif;max-width:520px;margin:auto;color:#1a202c">
          <div style="background:#0f1117;padding:24px;border-radius:12px;text-align:center">
            <h2 style="color:#4ade80;margin:0 0 6px">Rate Alert Triggered</h2>
            <p style="color:#94a3b8;margin:0;font-size:13px">{SITE_NAME}</p>
          </div>
          <div style="padding:24px 0">
            <p>The 30-year fixed mortgage rate has dropped to <strong>{current:.2f}%</strong>,
            below your alert threshold of <strong>{threshold:.2f}%</strong>.</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#f8fafc;border-radius:8px;overflow:hidden">
              <tr style="background:#e2e8f0">
                <th style="padding:10px 14px;text-align:left;font-size:13px">Metric</th>
                <th style="padding:10px 14px;text-align:right;font-size:13px">Value</th>
              </tr>
              <tr>
                <td style="padding:10px 14px;font-size:14px">Current rate</td>
                <td style="padding:10px 14px;text-align:right;font-size:14px;font-weight:bold;color:#16a34a">{current:.2f}%</td>
              </tr>
              <tr style="background:#f1f5f9">
                <td style="padding:10px 14px;font-size:14px">Your threshold</td>
                <td style="padding:10px 14px;text-align:right;font-size:14px">{threshold:.2f}%</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;font-size:14px">Est. savings on $500K loan</td>
                <td style="padding:10px 14px;text-align:right;font-size:14px;font-weight:bold;color:#16a34a">
                  ${saving_500k:.0f}/month
                </td>
              </tr>
            </table>
            <p style="color:#64748b;font-size:13px">
              This is a good time to reach out to lenders and lock your rate.
              Rates can move quickly — act within 1–2 business days to capture this level.
            </p>
          </div>
          <div style="border-top:1px solid #e2e8f0;padding-top:16px;font-size:12px;color:#94a3b8">
            ⚠️ For informational purposes only. Not financial advice.
            Rates from Mortgage News Daily / Freddie Mac PMMS.<br><br>
            <a href="https://yourdomain.com/unsubscribe?email={email}" style="color:#94a3b8">Unsubscribe</a>
          </div>
        </div>
        """
    })

def email_weekly(email: str, rate_today: float, rate_week_ago: float) -> None:
    change = rate_today - rate_week_ago
    arrow  = "▲" if change > 0 else "▼"
    color  = "#ef4444" if change > 0 else "#22c55e"
    resend.Emails.send({
        "from":    FROM_EMAIL,
        "to":      email,
        "subject": f"📊 Weekly Rate Update: 30yr at {rate_today:.2f}%",
        "html": f"""
        <div style="font-family:sans-serif;max-width:520px;margin:auto;color:#1a202c">
          <div style="background:#0f1117;padding:24px;border-radius:12px;text-align:center">
            <h2 style="color:#60a5fa;margin:0 0 6px">Weekly Rate Update</h2>
            <p style="color:#94a3b8;margin:0;font-size:13px">{SITE_NAME} · {datetime.today().strftime('%B %d, %Y')}</p>
          </div>
          <div style="padding:24px 0">
            <div style="text-align:center;padding:20px 0">
              <div style="font-size:48px;font-weight:bold;color:#1e293b">{rate_today:.2f}%</div>
              <div style="font-size:16px;color:{color};margin-top:4px">
                {arrow} {abs(change):.2f}% vs last week
              </div>
              <div style="font-size:13px;color:#64748b;margin-top:4px">30-Year Fixed · National Average</div>
            </div>
            <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden">
              <tr style="background:#e2e8f0">
                <th style="padding:10px 14px;text-align:left;font-size:13px">Payment on...</th>
                <th style="padding:10px 14px;text-align:right;font-size:13px">Monthly P&I</th>
              </tr>
              {''.join(f'<tr{"" if i%2 else " style=background:#f1f5f9"}><td style="padding:10px 14px;font-size:13px">${loan:,} home (20% down)</td><td style="padding:10px 14px;text-align:right;font-size:13px;font-weight:bold">${_monthly(rate_today, loan*0.8):.0f}</td></tr>' for i,loan in enumerate([400000,600000,800000]))}
            </table>
          </div>
          <div style="border-top:1px solid #e2e8f0;padding-top:16px;font-size:12px;color:#94a3b8">
            ⚠️ For informational purposes only. Source: Freddie Mac PMMS / MND.<br><br>
            <a href="https://yourdomain.com/unsubscribe?email={email}" style="color:#94a3b8">Unsubscribe</a>
          </div>
        </div>
        """
    })

def email_big_move(email: str, rate_now: float, rate_prev: float) -> None:
    change = rate_now - rate_prev
    direction = "dropped" if change < 0 else "jumped"
    color = "#22c55e" if change < 0 else "#ef4444"
    resend.Emails.send({
        "from":    FROM_EMAIL,
        "to":      email,
        "subject": f"⚡ Big Rate Move: 30yr {direction} {abs(change):.2f}% today",
        "html": f"""
        <div style="font-family:sans-serif;max-width:520px;margin:auto;color:#1a202c">
          <div style="background:#0f1117;padding:24px;border-radius:12px;text-align:center">
            <h2 style="color:{color};margin:0 0 6px">Big Rate Move Alert</h2>
            <p style="color:#94a3b8;margin:0;font-size:13px">{SITE_NAME}</p>
          </div>
          <div style="padding:24px 0;text-align:center">
            <p>The 30-year fixed rate <strong>{direction}</strong> by
            <strong style="color:{color}">{abs(change):.2f}%</strong> today.</p>
            <div style="font-size:42px;font-weight:bold;color:{color};margin:16px 0">{rate_now:.2f}%</div>
            <p style="color:#64748b;font-size:13px">Previous: {rate_prev:.2f}%</p>
          </div>
          <div style="border-top:1px solid #e2e8f0;padding-top:16px;font-size:12px;color:#94a3b8">
            ⚠️ Informational only. Not financial advice.<br><br>
            <a href="https://yourdomain.com/unsubscribe?email={email}" style="color:#94a3b8">Unsubscribe</a>
          </div>
        </div>
        """
    })

# ── Helper ────────────────────────────────────────────────────────────────────
def _monthly(rate: float, loan: float) -> float:
    r, n = rate / 100 / 12, 360
    return loan * r * (1+r)**n / ((1+r)**n - 1) if r > 0 else loan / n

# ── Scheduler jobs ────────────────────────────────────────────────────────────
async def job_check_rates():
    """Runs weekdays at 5PM ET — after MND updates at 4PM."""
    print(f"[{datetime.now()}] Checking rates...")
    rate = await fetch_current_rate()
    save_rate(rate)
    r30 = rate["r30"]

    con = get_db()
    subs = con.execute(
        "SELECT email, threshold, big_move FROM subscribers WHERE active=1"
    ).fetchall()

    # Get yesterday's rate for big-move comparison
    rows = con.execute(
        "SELECT r30 FROM rate_log ORDER BY date DESC LIMIT 2"
    ).fetchall()
    prev_r30 = rows[1][0] if len(rows) >= 2 else r30

    for email, threshold, big_move in subs:
        # Threshold alert
        if r30 <= threshold:
            try:
                email_alert(email, threshold, r30)
                print(f"  ✅ Threshold alert → {email}")
            except Exception as e:
                print(f"  ❌ Alert error {email}: {e}")

        # Big move alert (±0.15% in one day)
        if big_move and abs(r30 - prev_r30) >= 0.15:
            try:
                email_big_move(email, r30, prev_r30)
                print(f"  ⚡ Big move alert → {email}")
            except Exception as e:
                print(f"  ❌ Big move error {email}: {e}")

    con.close()

async def job_weekly_summary():
    """Runs every Monday at 8AM ET."""
    print(f"[{datetime.now()}] Sending weekly summaries...")
    rate = await fetch_current_rate()
    r30 = rate["r30"]

    con = get_db()
    rows = con.execute(
        "SELECT r30 FROM rate_log ORDER BY date DESC LIMIT 6"
    ).fetchall()
    r30_week_ago = rows[-1][0] if rows else r30

    subs = con.execute(
        "SELECT email FROM subscribers WHERE active=1 AND weekly=1"
    ).fetchall()
    for (email,) in subs:
        try:
            email_weekly(email, r30, r30_week_ago)
            print(f"  📊 Weekly → {email}")
        except Exception as e:
            print(f"  ❌ Weekly error {email}: {e}")
    con.close()

# ── FastAPI app ───────────────────────────────────────────────────────────────
scheduler = AsyncIOScheduler(timezone="America/New_York")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    # Weekdays 5PM ET — rate check
    scheduler.add_job(job_check_rates,  "cron", day_of_week="mon-fri", hour=17, minute=0)
    # Every Monday 8AM ET — weekly summary
    scheduler.add_job(job_weekly_summary, "cron", day_of_week="mon", hour=8, minute=0)
    scheduler.start()
    print("✅ Scheduler started")
    yield
    scheduler.shutdown()

app = FastAPI(title="Mortgage Rate Alert API", lifespan=lifespan)

app.add_middleware(CORSMiddleware,
    allow_origins=["*"],   # restrict to your domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

class SubscribeRequest(BaseModel):
    email:     str
    threshold: float
    weekly:    bool = True
    big_move:  bool = True

@app.post("/api/subscribe")
async def subscribe(req: SubscribeRequest):
    con = get_db()
    # Upsert: update threshold if email already exists
    existing = con.execute(
        "SELECT id FROM subscribers WHERE email=?", (req.email,)
    ).fetchone()
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

    # Send confirmation email
    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to":   req.email,
            "subject": f"✅ Rate alert set: notify me below {req.threshold:.2f}%",
            "html": f"""
            <div style="font-family:sans-serif;max-width:480px;margin:auto">
              <h2 style="color:#22c55e">You're subscribed!</h2>
              <p>We'll email you when the 30-year fixed rate drops below
              <strong>{req.threshold:.2f}%</strong>.</p>
              <p style="color:#64748b;font-size:13px">
                {"Weekly summaries: ON · " if req.weekly else ""}
                {"Big move alerts: ON" if req.big_move else ""}
              </p>
              <p style="font-size:12px;color:#94a3b8">
                <a href="https://yourdomain.com/unsubscribe?email={req.email}">Unsubscribe</a>
              </p>
            </div>
            """
        })
    except Exception as e:
        print(f"Confirmation email error: {e}")

    return {"status": "ok", "message": f"Alert set for {req.email} below {req.threshold:.2f}%"}

@app.get("/api/unsubscribe")
async def unsubscribe(email: str):
    con = get_db()
    con.execute("UPDATE subscribers SET active=0 WHERE email=?", (email,))
    con.commit()
    con.close()
    return {"status": "ok", "message": f"{email} unsubscribed"}

@app.get("/api/rates/latest")
async def latest_rate():
    rate = await fetch_current_rate()
    save_rate(rate)
    return rate

@app.get("/api/rates/history")
async def rate_history(days: int = 30):
    con = get_db()
    rows = con.execute(
        "SELECT date, r30, r15 FROM rate_log ORDER BY date DESC LIMIT ?", (days,)
    ).fetchall()
    con.close()
    return [{"date": r[0], "r30": r[1], "r15": r[2]} for r in rows]

@app.get("/api/subscribers/count")
async def subscriber_count():
    con = get_db()
    n = con.execute("SELECT COUNT(*) FROM subscribers WHERE active=1").fetchone()[0]
    con.close()
    return {"active": n}
