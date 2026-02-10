# Magadi Ward MCA 2027 Campaign Platform

A production-ready website for official campaign communication and public interaction, backed by a connected SQLite database.

## What is included
- Full website pages:
  - Home
  - About
  - Manifesto
  - Official Updates
  - Community Issues Desk
  - Events
  - Media
  - Contact
  - Accountability Dashboard
- Connected SQLite database (`data/campaign.db`) for:
  - Issue submissions with tracking reference IDs
  - Subscriber emails
  - Official updates
  - Events
- Resident issue tracking URL: `/track/<reference>`
- Admin issue list URL: `/admin/issues?token=<ADMIN_TOKEN>`

## Run locally
```bash
cp .env.example .env
python3 app.py
```
Then open: `http://localhost:3000`

## Deployment (public)

### Option A: Render (recommended simple flow)
1. Push this repository to GitHub.
2. In Render, create a new **Web Service** from the repo.
3. Runtime: Python.
4. Build command: *(leave empty)*.
5. Start command: `python3 app.py`.
6. Set environment variables:
   - `PORT=10000` (or Render default)
   - `CANDIDATE_NAME=Your Name`
   - `ADMIN_TOKEN=<strong-secret>`
   - `DB_PATH=/var/data/campaign.db`
7. Add a persistent disk mounted at `/var/data`.
8. Point custom domain and enable HTTPS.

### Option B: Railway / Fly.io
- Start command: `python3 app.py`
- Set environment variables as above.
- Ensure persistent volume is configured and `DB_PATH` points to that volume.

## Post-deploy setup checklist
- Replace placeholder contact details.
- Set strong `ADMIN_TOKEN`.
- Configure your custom domain.
- Publish official weekly updates and events.
- Back up DB daily.
