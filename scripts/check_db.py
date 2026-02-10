import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from app import init_db, db_conn

init_db()
conn = db_conn()
updates = conn.execute('SELECT COUNT(*) FROM updates').fetchone()[0]
events = conn.execute('SELECT COUNT(*) FROM events').fetchone()[0]
conn.close()
if updates < 1 or events < 1:
    raise SystemExit('DB check failed')
print(f'DB check passed: updates={updates}, events={events}')
