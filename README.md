# 🏠 Mortgage Rate Tracker

A daily mortgage rate dashboard with a built-in payment calculator and automated email alerts. Built with vanilla HTML/JS for the frontend and Python (FastAPI) for the backend.

![Static Badge](https://img.shields.io/badge/data-Freddie%20Mac%20PMMS-blue)
![Static Badge](https://img.shields.io/badge/email-Resend-green)
![Static Badge](https://img.shields.io/badge/backend-Python%20%2B%20FastAPI-orange)
![Static Badge](https://img.shields.io/badge/license-MIT-gray)

## ✨ Features

- **Daily rate updates** — 30yr fixed, 15yr fixed, 5/1 ARM from Mortgage News Daily + Bankrate
- **Interactive chart** — view rate trends over 2 weeks, 1 month, 3 months, or all time
- **Payment calculator** — enter home price, down payment, and term to get instant monthly payment, total interest, and a 5-year amortization schedule
- **Rate drop alerts** — subscribe with your email and get notified when rates fall below your target threshold
- **Weekly summaries** — optional Monday morning rate digest
- **Big move alerts** — get notified when rates move ±0.15% in a single day
- **No dependencies** on the frontend — pure HTML, CSS, and JavaScript

## 📸 Screenshot

> Dashboard · Payment Calculator modal · Rate Alert modal

## 🗂 Project Structure

```
mortgage-rate-tracker/
├── mortgage-tracker-v5.html   # Frontend — self-contained, zero npm required
├── main.py                    # Backend — FastAPI + APScheduler + Resend
├── .env                       # API keys (not committed)
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Frontend only

Just open `mortgage-tracker-v5.html` in any browser. No build step, no server needed. Rate data is embedded and the calculator works immediately.

### Full stack (with email alerts)

**1. Install dependencies**

```bash
pip install fastapi uvicorn resend httpx apscheduler
```

**2. Set up your `.env` file**

```bash
RESEND_API_KEY=re_your_key_here
FROM_EMAIL=alerts@yourdomain.com
```

Get your free Resend API key at [resend.com](https://resend.com) — free tier includes 3,000 emails/month.

**3. Run the server**

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

**4. Point the frontend at your backend**

In `mortgage-tracker-v5.html`, the alert form already POSTs to `/api/subscribe`. If your backend runs on a different host, update the fetch URL accordingly.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/subscribe` | Subscribe to rate alerts |
| `GET` | `/api/unsubscribe?email=` | Unsubscribe |
| `GET` | `/api/rates/latest` | Fetch current rate from FRED |
| `GET` | `/api/rates/history?days=30` | Rate history log |
| `GET` | `/api/subscribers/count` | Active subscriber count |

## ⏰ Scheduled Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| Rate check + alerts | Weekdays 5PM ET | Fetches latest rate, emails subscribers whose threshold is met |
| Weekly summary | Mondays 8AM ET | Sends rate digest to all weekly subscribers |

## 📡 Data Sources

- **[Mortgage News Daily](https://www.mortgagenewsdaily.com/mortgage-rates)** — daily rate index from real lender rate sheets, updated ~4PM ET
- **[Freddie Mac PMMS](https://www.freddiemac.com/pmms)** via **[FRED API](https://fred.stlouisfed.org)** — official weekly survey, used for automated fetching
- **[Bankrate](https://www.bankrate.com/mortgages/todays-rates/)** — daily cross-reference

## ⚠️ Disclaimer

Rates shown are national averages for **informational purposes only** and do not constitute a loan offer or commitment. The payment calculator shows principal and interest only — it does not include property taxes, homeowners insurance, or PMI. Always consult a licensed mortgage professional for personalized advice.

## 📄 License

MIT — free to use, modify, and deploy.
