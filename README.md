# Cybersecurity Training Demos

Browser-based demos, including a **phishing awareness training** simulation.

## Phishing simulation (Fake IRS Scam)

Educational tool that shows a simulated IRS phishing email in a mock inbox, a fake verification form, and a full-screen lesson after submit. Nothing is stored or sent to real IRS systems.

### Run locally

1. Double-click `phishing-simulation/start-fake-irs-scam.bat`, **or**
2. Open `phishing-simulation/fake-irs-scam.html` in your browser

Then open: [http://localhost:8080/fake-irs-scam.html](http://localhost:8080/fake-irs-scam.html)

### Features

- Simulated phishing email with common red flags
- Fake “claim refund” verification form (data is discarded)
- Educational overlay explaining warning signs and IRS best practices
- **Send to Email** for authorized training (EmailJS or `.eml` download)

**Authorized training use only.** Only send simulations to people who have consented.

## Pull-cord lamp demo

Interactive hanging lamp UI in the project root (`index.html`, `styles.css`, `script.js`).
