# Abraham Senteu — Official Magadi Ward MCA 2027 Platform

Advanced campaign website for **public interaction**, **official updates**, **issue tracking**, and **database-backed operations**.

## What was upgraded
- Personalized platform identity for **Abraham Senteu**.
- Complete public site pages:
  - Home
  - About
  - Manifesto
  - Official Updates
  - Issues Desk (with tracking references)
  - Events
  - Media Centre
  - Contact + messaging
  - Accountability Dashboard
- Database-connected workflows (SQLite):
  - issue submissions
  - issue status tracking
  - subscriber management
  - official updates publishing
  - events publishing
  - direct contact messages
- Admin dashboard capabilities (token-protected):
  - update issue statuses
  - publish official updates
  - create events
  - review direct messages
- API endpoint for live homepage metrics: `/api/stats`.

## Local run
```bash
cp .env.example .env
python3 scripts/check_db.py
python3 app.py
```
Open `http://localhost:3000`.

## Environment variables
- `PORT=3000`
- `CANDIDATE_NAME=Abraham Senteu`
- `ADMIN_TOKEN=<strong-secret>`
- `DB_PATH=./data/campaign.db`

## Admin access
`/admin?token=<ADMIN_TOKEN>`

## Deployment (Render-ready)
You can deploy immediately using `deploy_render.yaml`.

### Manual Render steps
1. Push repository to GitHub.
2. Create a Render **Web Service** from this repo.
3. Start command: `python3 app.py`.
4. Add environment variables above.
5. Mount persistent disk at `/var/data` and set `DB_PATH=/var/data/campaign.db`.
6. Set your custom domain and enable HTTPS.

## Deployment note
I prepared the project fully for deployment, but actual live deployment requires access to your hosting account (Render/Railway/Fly/VPS).

## Security checklist before public launch
- Set strong `ADMIN_TOKEN`.
- Replace placeholder phone/email with official campaign contacts.
- Keep daily database backups.
- Use HTTPS-only domain.
