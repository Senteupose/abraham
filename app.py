import mimetypes
import os
import secrets
import sqlite3
import sys
from datetime import datetime
from urllib.parse import parse_qs
from wsgiref.simple_server import make_server

from jinja2 import Environment, FileSystemLoader, TemplateNotFound, select_autoescape

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
PUBLIC_DIR = os.path.realpath(os.path.join(BASE_DIR, 'public'))
TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')
os.makedirs(DATA_DIR, exist_ok=True)

DB_PATH = os.getenv('DB_PATH', os.path.join(DATA_DIR, 'campaign.db'))
PORT = int(os.getenv('PORT', '3000'))
CANDIDATE_NAME = os.getenv('CANDIDATE_NAME', '[Your Name]')
ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', 'change-me')
ENV = os.getenv('ENV', 'development').lower()

INSECURE_ADMIN_TOKENS = {'', 'change-me'}


def check_startup_config():
    if ADMIN_TOKEN in INSECURE_ADMIN_TOKENS:
        if ENV == 'production':
            raise SystemExit(
                'Refusing to start: ADMIN_TOKEN is unset or default. '
                "Set ADMIN_TOKEN to a strong secret when ENV=production."
            )
        print(
            'WARNING: ADMIN_TOKEN is unset or the default placeholder. '
            'Admin pages are effectively unprotected. Set ADMIN_TOKEN before deploying.',
            file=sys.stderr,
        )


jinja_env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=select_autoescape(['html', 'xml']),
    trim_blocks=True,
    lstrip_blocks=True,
)


def render(template_name, **context):
    context.setdefault('candidate_name', CANDIDATE_NAME)
    context.setdefault('title', 'Magadi 2027')
    template = jinja_env.get_template(template_name)
    return template.render(**context).encode('utf-8')


def db_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS issues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference TEXT UNIQUE NOT NULL,
        full_name TEXT,
        phone TEXT,
        area TEXT NOT NULL,
        category TEXT NOT NULL,
        urgency TEXT DEFAULT 'Normal',
        message TEXT NOT NULL,
        status TEXT DEFAULT 'Received',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')
    cur.execute('''CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')
    cur.execute('''CREATE TABLE IF NOT EXISTS updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT,
        status TEXT DEFAULT 'Ongoing',
        body TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')
    cur.execute('''CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        venue TEXT NOT NULL,
        event_date TEXT NOT NULL,
        agenda TEXT NOT NULL
    )''')

    if cur.execute('SELECT COUNT(*) FROM updates').fetchone()[0] == 0:
        cur.executemany(
            'INSERT INTO updates (title, category, location, status, body) VALUES (?, ?, ?, ?, ?)',
            [
                ('Official Launch of Digital Ward Platform', 'Official Statement', 'Magadi Town', 'Completed', 'This platform is now the official channel for communication, issue reporting, and campaign updates for Magadi Ward.'),
                ('Water Points Assessment Ongoing', 'Development Update', 'Shompole & Nguruman', 'Ongoing', 'Field visits have started to map non-functional water points and prioritize rehabilitation requests.'),
                ('Ward Baraza Schedule Published', 'Event Announcement', 'All Villages', 'Planned', 'A 30-day public meeting calendar has been published to ensure every area is represented.'),
            ],
        )

    if cur.execute('SELECT COUNT(*) FROM events').fetchone()[0] == 0:
        cur.executemany(
            'INSERT INTO events (title, venue, event_date, agenda) VALUES (?, ?, ?, ?)',
            [
                ('Community Listening Forum', 'Magadi Social Hall', '2026-03-15 10:00', 'Water access, roads, youth opportunities'),
                ('Women Leadership Dialogue', 'Oloika Primary Grounds', '2026-03-22 11:00', 'Women empowerment and safety priorities'),
                ('Youth Skills Baraza', 'Nguruman Market Center', '2026-03-29 09:30', 'Skills, enterprise and mentorship support'),
            ],
        )

    conn.commit()
    conn.close()


def fetch_updates(limit=50):
    conn = db_conn()
    rows = conn.execute('SELECT * FROM updates ORDER BY datetime(created_at) DESC LIMIT ?', (limit,)).fetchall()
    conn.close()
    return rows


def fetch_events(limit=20):
    conn = db_conn()
    rows = conn.execute('SELECT * FROM events ORDER BY datetime(event_date) ASC LIMIT ?', (limit,)).fetchall()
    conn.close()
    return rows


def generate_reference():
    return f"MGD-2027-{secrets.token_hex(6).upper()}"


def parse_post(environ, max_bytes=16 * 1024):
    try:
        size = int(environ.get('CONTENT_LENGTH', '0'))
    except ValueError:
        size = 0
    size = max(0, min(size, max_bytes))
    body = environ['wsgi.input'].read(size).decode('utf-8', errors='replace')
    fields = parse_qs(body)
    return {k: v[0] for k, v in fields.items()}


def serve_static(path, start_response):
    rel = path[len('/public/'):]
    if not rel:
        start_response('404 Not Found', [('Content-Type', 'text/plain')])
        return [b'Not found']

    candidate = os.path.realpath(os.path.join(PUBLIC_DIR, rel))
    if os.path.commonpath([candidate, PUBLIC_DIR]) != PUBLIC_DIR or not os.path.isfile(candidate):
        start_response('404 Not Found', [('Content-Type', 'text/plain')])
        return [b'Not found']

    ctype, _ = mimetypes.guess_type(candidate)
    if not ctype:
        ctype = 'application/octet-stream'
    with open(candidate, 'rb') as f:
        data = f.read()
    start_response('200 OK', [('Content-Type', ctype), ('X-Content-Type-Options', 'nosniff')])
    return [data]


def html_response(start_response, status, body):
    start_response(status, [('Content-Type', 'text/html; charset=utf-8')])
    return [body]


def app(environ, start_response):
    path = environ.get('PATH_INFO', '/')
    method = environ.get('REQUEST_METHOD', 'GET')

    if path.startswith('/public/'):
        return serve_static(path, start_response)

    if path == '/' and method == 'GET':
        return html_response(start_response, '200 OK', render(
            'home.html',
            title='Official Platform | MCA 2027 Magadi Ward',
            updates=fetch_updates(3),
            events=fetch_events(3),
        ))

    simple_pages = {
        '/about': ('about.html', 'About | Magadi 2027'),
        '/manifesto': ('manifesto.html', 'Manifesto | Magadi 2027'),
        '/media': ('media.html', 'Media | Magadi 2027'),
        '/accountability': ('accountability.html', 'Accountability | Magadi 2027'),
    }
    if path in simple_pages and method == 'GET':
        tpl, title = simple_pages[path]
        return html_response(start_response, '200 OK', render(tpl, title=title))

    if path == '/updates' and method == 'GET':
        return html_response(start_response, '200 OK', render(
            'updates.html', title='Official Updates', updates=fetch_updates(50),
        ))

    if path == '/events' and method == 'GET':
        return html_response(start_response, '200 OK', render(
            'events.html', title='Events', events=fetch_events(20),
        ))

    if path == '/issues' and method == 'GET':
        return html_response(start_response, '200 OK', render(
            'issues.html', title='Issues Desk',
        ))

    if path == '/issues' and method == 'POST':
        fields = parse_post(environ)
        if not fields.get('area') or not fields.get('category') or not fields.get('message'):
            return html_response(start_response, '400 Bad Request', render(
                'message.html',
                title='Invalid submission',
                level='error',
                message='Area, category and message are required.',
                back_href='/issues',
            ))

        ref = generate_reference()
        conn = db_conn()
        conn.execute(
            'INSERT INTO issues (reference, full_name, phone, area, category, urgency, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (ref, fields.get('full_name'), fields.get('phone'), fields['area'], fields['category'],
             fields.get('urgency', 'Normal'), fields['message']),
        )
        conn.commit()
        conn.close()
        return html_response(start_response, '200 OK', render(
            'issue_received.html', title='Issue Received', reference=ref,
        ))

    if path.startswith('/track/') and method == 'GET':
        ref = path.split('/track/', 1)[1]
        conn = db_conn()
        row = conn.execute('SELECT * FROM issues WHERE reference = ?', (ref,)).fetchone()
        conn.close()
        return html_response(start_response, '200 OK', render(
            'track.html', title='Track Issue', issue=row,
        ))

    if path == '/contact' and method == 'GET':
        return html_response(start_response, '200 OK', render(
            'contact.html', title='Contact',
        ))

    if path == '/subscribe' and method == 'POST':
        fields = parse_post(environ)
        email = fields.get('email', '').strip()
        if not email or '@' not in email:
            return html_response(start_response, '400 Bad Request', render(
                'message.html',
                title='Contact',
                level='error',
                message='Please provide a valid email.',
                back_href='/contact',
            ))
        conn = db_conn()
        conn.execute('INSERT OR IGNORE INTO subscribers (email) VALUES (?)', (email,))
        conn.commit()
        conn.close()
        return html_response(start_response, '200 OK', render(
            'message.html',
            title='Contact',
            level='success',
            message='Subscribed successfully.',
            back_href='/contact',
        ))

    if path == '/admin/issues' and method == 'GET':
        query = parse_qs(environ.get('QUERY_STRING', ''))
        token = query.get('token', [''])[0]
        if not secrets.compare_digest(token, ADMIN_TOKEN):
            start_response('401 Unauthorized', [('Content-Type', 'text/plain; charset=utf-8')])
            return [b'Unauthorized']
        conn = db_conn()
        rows = conn.execute('SELECT * FROM issues ORDER BY datetime(created_at) DESC').fetchall()
        conn.close()
        return html_response(start_response, '200 OK', render(
            'admin_issues.html', title='Admin Issues', issues=rows,
        ))

    try:
        body = render('not_found.html', title='Not Found')
    except TemplateNotFound:
        body = b'Not found'
    return html_response(start_response, '404 Not Found', body)


check_startup_config()
init_db()


if __name__ == '__main__':
    httpd = make_server('0.0.0.0', PORT, app)
    print(f'Server running on http://localhost:{PORT}')
    httpd.serve_forever()
