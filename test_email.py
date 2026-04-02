import os
from dotenv import load_dotenv
import resend

load_dotenv()
resend.api_key = os.getenv("re_MKbLzXHB_7v2Ze19Nd8QJ1mpCJvzsvkgC")

resend.Emails.send({
    "from": "onboarding@resend.dev",
    "to": "huili.si.shl@gmail.com",      # 收件人换成你自己
    "subject": "Test from Mortgage Tracker",
    "html": "<h2>It works! 🎉</h2><p>Rate alert system is live.</p>"
})

print("Email sent!")