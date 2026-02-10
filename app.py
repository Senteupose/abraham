import os
import sqlite3
from urllib.parse import parse_qs
from wsgiref.simple_server import make_server
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.getenv('DB_PATH', os.path.join(DATA_DIR, 'campaign.db'))
PORT = int(os.getenv('PORT', '3000'))
CANDIDATE_NAME = os.getenv('CANDIDATE_NAME', '[Your Name]')
ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', 'change-me')


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


def nav():
    return '''
    <header class="site-header"><div class="container nav-wrap">
      <a class="logo" href="/">Magadi 2027</a>
      <nav>
        <a href="/about">About</a><a href="/manifesto">Manifesto</a><a href="/updates">Updates</a>
        <a href="/issues">Issues Desk</a><a href="/events">Events</a><a href="/media">Media</a>
        <a href="/contact">Contact</a><a href="/accountability">Accountability</a>
      </nav>
    </div></header>
    '''


def layout(title, body):
    return f'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{title}</title><link rel="stylesheet" href="/public/styles.css"></head><body>{nav()}<main class="container">{body}</main>
    <footer class="site-footer"><div class="container"><p>Official platform for {CANDIDATE_NAME} | MCA 2027 Magadi Ward.</p></div></footer>
    </body></html>'''.encode('utf-8')


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
    return f"MGD-2027-{datetime.now().strftime('%f%S')}"


def parse_post(environ):
    try:
      size = int(environ.get('CONTENT_LENGTH', '0'))
    except ValueError:
      size = 0
    body = environ['wsgi.input'].read(size).decode('utf-8')
    fields = parse_qs(body)
    return {k: v[0] for k, v in fields.items()}


def app(environ, start_response):
    path = environ.get('PATH_INFO', '/')
    method = environ.get('REQUEST_METHOD', 'GET')

    if path.startswith('/public/'):
        file_path = os.path.join(BASE_DIR, path.lstrip('/'))
        if os.path.exists(file_path):
            start_response('200 OK', [('Content-Type', 'text/css; charset=utf-8')])
            with open(file_path, 'rb') as f:
                return [f.read()]
        start_response('404 Not Found', [('Content-Type', 'text/plain')])
        return [b'Not found']

    if path == '/' and method == 'GET':
        updates = fetch_updates(3)
        events = fetch_events(3)
        body = f'''
        <section class="hero"><h1>{CANDIDATE_NAME} for MCA 2027, Magadi Ward</h1>
        <p>Listening. Acting. Reporting back officially to the people of Magadi.</p>
        <div class="cta-row"><a class="btn" href="/issues">Submit a Community Issue</a><a class="btn btn-secondary" href="/updates">Read Official Updates</a></div></section>
        <section><h2>Latest Official Updates</h2><div class="grid">{''.join([f"<article class='card'><span class='tag'>{u['category']}</span><h3>{u['title']}</h3><p>{u['body']}</p><small>{u['location']} · {u['status']}</small></article>" for u in updates])}</div></section>
        <section><h2>Upcoming Events</h2><div class="grid">{''.join([f"<article class='card'><h3>{e['title']}</h3><p><strong>Venue:</strong> {e['venue']}</p><p><strong>Date:</strong> {e['event_date']}</p><p>{e['agenda']}</p></article>" for e in events])}</div></section>
        '''
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [layout('Official Platform | MCA 2027 Magadi Ward', body)]

    simple_pages = {
        '/about': '<h1>About</h1><p>This is the official profile page for campaign leadership, values, and why I am running for MCA in Magadi Ward.</p>',
        '/manifesto': '<h1>Manifesto</h1><ul><li>Water Access</li><li>Roads & Transport</li><li>Youth Jobs</li><li>Health & Education</li><li>Women Empowerment</li><li>Governance & Transparency</li></ul>',
        '/media': '<h1>Media Center</h1><p>Upload campaign photos, short video updates, and press mentions.</p>',
        '/accountability': '<h1>Transparency Dashboard</h1><p>Promises made, actions completed, in progress, and delayed reasons should be published monthly.</p>',
    }

    if path in simple_pages and method == 'GET':
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [layout('Magadi 2027', simple_pages[path])]

    if path == '/updates' and method == 'GET':
        rows = fetch_updates(50)
        cards = []
        for r in rows:
            cards.append(f"<article class='card'><span class='tag'>{r['category']}</span><h3>{r['title']}</h3><p>{r['body']}</p><small>{r['created_at']} | {r['location']} | {r['status']}</small></article>")
        body = "<h1>Official Updates</h1><div class='grid'>" + ''.join(cards) + "</div>"
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [layout('Official Updates', body)]

    if path == '/events' and method == 'GET':
        rows = fetch_events(20)
        cards = []
        for r in rows:
            cards.append(f"<article class='card'><h3>{r['title']}</h3><p><strong>Venue:</strong> {r['venue']}</p><p><strong>Date:</strong> {r['event_date']}</p><p>{r['agenda']}</p></article>")
        body = "<h1>Events & Meetings</h1><div class='grid'>" + ''.join(cards) + "</div>"
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [layout('Events', body)]

    if path == '/issues' and method == 'GET':
        body = '''<h1>Community Issues Desk</h1><p>Submit a community issue and get a tracking reference.</p>
        <form class="form" method="post" action="/issues">
        <input name="full_name" placeholder="Full Name (optional)"><input name="phone" placeholder="Phone (optional)">
        <input name="area" placeholder="Area / Village" required>
        <select name="category" required><option value="">Select category</option><option>Water</option><option>Roads/Transport</option><option>Health</option><option>Education</option><option>Security</option><option>Youth/Women Opportunities</option><option>Environment</option><option>Other</option></select>
        <select name="urgency"><option>Normal</option><option>High</option><option>Critical</option></select>
        <textarea name="message" placeholder="Describe the issue" required></textarea>
        <button class="btn" type="submit">Submit Issue</button></form>'''
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [layout('Issues Desk', body)]

    if path == '/issues' and method == 'POST':
        fields = parse_post(environ)
        if not fields.get('area') or not fields.get('category') or not fields.get('message'):
            start_response('400 Bad Request', [('Content-Type', 'text/html; charset=utf-8')])
            return [layout('Invalid submission', '<p class="error">Area, category and message are required.</p><p><a href="/issues">Back</a></p>')]

        ref = generate_reference()
        conn = db_conn()
        conn.execute('INSERT INTO issues (reference, full_name, phone, area, category, urgency, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
                     (ref, fields.get('full_name'), fields.get('phone'), fields['area'], fields['category'], fields.get('urgency', 'Normal'), fields['message']))
        conn.commit()
        conn.close()
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [layout('Issue Received', f'<p class="success">Issue received. Reference: <strong>{ref}</strong>.</p><p>Track it here: <a href="/track/{ref}">/track/{ref}</a></p>')]

    if path.startswith('/track/') and method == 'GET':
        ref = path.split('/track/', 1)[1]
        conn = db_conn()
        row = conn.execute('SELECT * FROM issues WHERE reference = ?', (ref,)).fetchone()
        conn.close()
        if row:
            body = f"<h1>Issue Tracking</h1><article class='card'><h3>{row['reference']}</h3><p><strong>Area:</strong> {row['area']}</p><p><strong>Category:</strong> {row['category']}</p><p><strong>Status:</strong> {row['status']}</p><p>{row['message']}</p></article>"
        else:
            body = '<h1>Issue Tracking</h1><p>No issue found for that reference.</p>'
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [layout('Track Issue', body)]

    if path == '/contact' and method == 'GET':
        body = '''<h1>Official Contact</h1><ul><li>Phone/WhatsApp: +254 XXX XXX XXX</li><li>Email: official@magadi2027.org</li><li>Office Hours: Mon-Sat, 8:00 AM - 5:00 PM</li></ul>
        <h2>Subscribe for Updates</h2><form class="form-inline" method="post" action="/subscribe"><input type="email" name="email" required placeholder="you@example.com"><button class="btn" type="submit">Subscribe</button></form>'''
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [layout('Contact', body)]

    if path == '/subscribe' and method == 'POST':
        fields = parse_post(environ)
        email = fields.get('email', '').strip()
        if not email or '@' not in email:
            start_response('400 Bad Request', [('Content-Type', 'text/html; charset=utf-8')])
            return [layout('Contact', '<p class="error">Please provide a valid email.</p><p><a href="/contact">Back</a></p>')]
        conn = db_conn()
        conn.execute('INSERT OR IGNORE INTO subscribers (email) VALUES (?)', (email,))
        conn.commit()
        conn.close()
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [layout('Contact', '<p class="success">Subscribed successfully.</p><p><a href="/contact">Back</a></p>')]

    if path == '/admin/issues' and method == 'GET':
        query = parse_qs(environ.get('QUERY_STRING', ''))
        token = query.get('token', [''])[0]
        if token != ADMIN_TOKEN:
            start_response('401 Unauthorized', [('Content-Type', 'text/plain; charset=utf-8')])
            return [b'Unauthorized']
        conn = db_conn()
        rows = conn.execute('SELECT * FROM issues ORDER BY datetime(created_at) DESC').fetchall()
        conn.close()
        body = '<h1>Admin Issues</h1><table><tr><th>Reference</th><th>Area</th><th>Category</th><th>Status</th></tr>' + ''.join([f"<tr><td>{r['reference']}</td><td>{r['area']}</td><td>{r['category']}</td><td>{r['status']}</td></tr>" for r in rows]) + '</table>'
        start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
        return [layout('Admin Issues', body)]

    start_response('404 Not Found', [('Content-Type', 'text/html; charset=utf-8')])
    return [layout('Not Found', '<h1>404</h1><p>Page not found.</p>')]


if __name__ == '__main__':
    init_db()
    httpd = make_server('0.0.0.0', PORT, app)
    print(f'Server running on http://localhost:{PORT}')
    httpd.serve_forever()
