import os
import sqlite3
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from app import DB_PATH, init_db

init_db()
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

checks = {
    "issues": cur.execute("SELECT COUNT(*) FROM issues").fetchone()[0],
    "subscribers": cur.execute("SELECT COUNT(*) FROM subscribers").fetchone()[0],
    "updates": cur.execute("SELECT COUNT(*) FROM updates").fetchone()[0],
    "events": cur.execute("SELECT COUNT(*) FROM events").fetchone()[0],
    "contact_messages": cur.execute("SELECT COUNT(*) FROM contact_messages").fetchone()[0],
}

if checks["updates"] < 1 or checks["events"] < 1:
    raise SystemExit(f"DB check failed: {checks}")

print(f"DB check passed: {checks}")
conn.close()
