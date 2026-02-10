import html
import os
import secrets
import sqlite3
from datetime import datetime
from urllib.parse import parse_qs
from wsgiref.simple_server import make_server

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")
os.makedirs(DATA_DIR, exist_ok=True)

PORT = int(os.getenv("PORT", "3000"))
DB_PATH = os.getenv("DB_PATH", os.path.join(DATA_DIR, "campaign.db"))
CANDIDATE_NAME = os.getenv("CANDIDATE_NAME", "Abraham Senteu")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "change-me")
SITE_TAGLINE = "Official MCA 2027 Platform for Magadi Ward"


def db_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = db_conn()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS issues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reference TEXT UNIQUE NOT NULL,
            full_name TEXT,
            phone TEXT,
            area TEXT NOT NULL,
            category TEXT NOT NULL,
            urgency TEXT DEFAULT 'Normal',
            message TEXT NOT NULL,
            status TEXT DEFAULT 'Received',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS updates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT,
            status TEXT DEFAULT 'Ongoing',
            body TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            venue TEXT NOT NULL,
            event_date TEXT NOT NULL,
            agenda TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            phone TEXT,
            topic TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    count_updates = cur.execute("SELECT COUNT(*) AS c FROM updates").fetchone()["c"]
    if count_updates == 0:
        cur.executemany(
            "INSERT INTO updates (title, category, location, status, body) VALUES (?, ?, ?, ?, ?)",
            [
                (
                    "Official Launch of Abraham Senteu Digital Platform",
                    "Official Statement",
                    "Magadi Ward",
                    "Completed",
                    "This website is now the official platform for updates, public engagement, issue reporting, and campaign accountability.",
                ),
                (
                    "Water Access Mapping Underway",
                    "Development Update",
                    "Shompole, Olkiramatian, Nguruman",
                    "Ongoing",
                    "Community mapping has started to identify non-functional water points and prioritize interventions.",
                ),
                (
                    "Ward Listening Forums Calendar Published",
                    "Event Announcement",
                    "All Magadi Zones",
                    "Planned",
                    "A structured listening forum calendar has been published for residents to raise local priorities.",
                ),
            ],
        )

    count_events = cur.execute("SELECT COUNT(*) AS c FROM events").fetchone()["c"]
    if count_events == 0:
        cur.executemany(
            "INSERT INTO events (title, venue, event_date, agenda) VALUES (?, ?, ?, ?)",
            [
                (
                    "Community Listening Forum",
                    "Magadi Social Hall",
                    "2026-03-15 10:00",
                    "Water, roads, and youth opportunities",
                ),
                (
                    "Women Leadership Dialogue",
                    "Oloika Primary Grounds",
                    "2026-03-22 11:00",
                    "Women empowerment, safety, and enterprise",
                ),
                (
                    "Youth Skills Baraza",
                    "Nguruman Market Centre",
                    "2026-03-29 09:30",
                    "Skills, jobs, and micro-enterprise roadmap",
                ),
            ],
        )

    conn.commit()
    conn.close()


def h(text):
    return html.escape(str(text or ""))


def read_template(name):
    with open(os.path.join(TEMPLATE_DIR, name), "r", encoding="utf-8") as f:
        return f.read()


def render(page_title, content, flash=""):
    base = read_template("base.html")
    return (
        base.replace("{{TITLE}}", h(page_title))
        .replace("{{CANDIDATE_NAME}}", h(CANDIDATE_NAME))
        .replace("{{TAGLINE}}", h(SITE_TAGLINE))
        .replace("{{FLASH}}", flash)
        .replace("{{CONTENT}}", content)
    ).encode("utf-8")


def parse_post(environ):
    length = int(environ.get("CONTENT_LENGTH") or "0")
    raw = environ["wsgi.input"].read(length).decode("utf-8")
    parsed = parse_qs(raw)
    return {k: (v[0] if isinstance(v, list) and v else "") for k, v in parsed.items()}


def query(conn, sql, params=()):
    return conn.execute(sql, params).fetchall()


def one(conn, sql, params=()):
    return conn.execute(sql, params).fetchone()


def issue_reference():
    return f"MGD-2027-{datetime.utcnow().strftime('%y%m%d%H%M%S')}-{secrets.token_hex(2).upper()}"


def home_page():
    conn = db_conn()
    updates = query(conn, "SELECT * FROM updates ORDER BY datetime(created_at) DESC LIMIT 3")
    events = query(conn, "SELECT * FROM events ORDER BY datetime(event_date) ASC LIMIT 3")
    stats = one(
        conn,
        """
        SELECT
            (SELECT COUNT(*) FROM issues) AS total_issues,
            (SELECT COUNT(*) FROM issues WHERE status='Resolved') AS resolved_issues,
            (SELECT COUNT(*) FROM subscribers) AS subscribers,
            (SELECT COUNT(*) FROM updates) AS updates_count
        """,
    )
    conn.close()

    updates_cards = "".join(
        [
            f"<article class='card'><p class='pill'>{h(u['category'])}</p><h3>{h(u['title'])}</h3><p>{h(u['body'])}</p><small>{h(u['location'])} · {h(u['status'])}</small></article>"
            for u in updates
        ]
    )
    events_cards = "".join(
        [
            f"<article class='card'><h3>{h(e['title'])}</h3><p><b>Venue:</b> {h(e['venue'])}</p><p><b>Date:</b> {h(e['event_date'])}</p><p>{h(e['agenda'])}</p></article>"
            for e in events
        ]
    )

    return f"""
    <section class='hero'>
        <p class='eyebrow'>Official Platform</p>
        <h1>Abraham Senteu for MCA 2027, Magadi Ward</h1>
        <p class='lead'>A public platform for direct communication, official updates, and accountable leadership.</p>
        <div class='btn-row'>
            <a class='btn' href='/issues'>Submit Community Issue</a>
            <a class='btn btn-secondary' href='/updates'>Read Official Updates</a>
        </div>
    </section>

    <section class='stats' id='live-stats'>
        <div><strong>{stats['total_issues']}</strong><span>Issues Reported</span></div>
        <div><strong>{stats['resolved_issues']}</strong><span>Issues Resolved</span></div>
        <div><strong>{stats['subscribers']}</strong><span>Subscribers</span></div>
        <div><strong>{stats['updates_count']}</strong><span>Official Updates</span></div>
    </section>

    <section>
        <h2>Top Priorities</h2>
        <ul class='priority-list'>
            <li>Water access and drought resilience</li>
            <li>Roads and transport connectivity</li>
            <li>Youth jobs and enterprise pathways</li>
            <li>Health, education, and women empowerment</li>
            <li>Transparent ward governance</li>
        </ul>
    </section>

    <section><h2>Latest Official Updates</h2><div class='grid'>{updates_cards}</div></section>
    <section><h2>Upcoming Public Meetings</h2><div class='grid'>{events_cards}</div></section>
    """


def updates_page():
    conn = db_conn()
    updates = query(conn, "SELECT * FROM updates ORDER BY datetime(created_at) DESC LIMIT 100")
    conn.close()
    cards = "".join(
        [
            f"<article class='card'><p class='pill'>{h(row['category'])}</p><h3>{h(row['title'])}</h3><p>{h(row['body'])}</p><small>{h(row['created_at'])} | {h(row['location'])} | {h(row['status'])}</small></article>"
            for row in updates
        ]
    )
    return f"<h1>Official Updates</h1><p>This is the official record of communication from Abraham Senteu.</p><div class='grid'>{cards}</div>"


def events_page():
    conn = db_conn()
    events = query(conn, "SELECT * FROM events ORDER BY datetime(event_date) ASC")
    conn.close()
    cards = "".join(
        [
            f"<article class='card'><h3>{h(row['title'])}</h3><p><b>Venue:</b> {h(row['venue'])}</p><p><b>Date:</b> {h(row['event_date'])}</p><p><b>Agenda:</b> {h(row['agenda'])}</p></article>"
            for row in events
        ]
    )
    return f"<h1>Events & Meetings</h1><div class='grid'>{cards}</div>"


def issues_form(message=""):
    return f"""
    <h1>Community Issues Desk</h1>
    <p>Report an issue and get a reference for tracking.</p>
    {message}
    <form method='post' action='/issues' class='form'>
        <input name='full_name' placeholder='Full name (optional)' />
        <input name='phone' placeholder='Phone (optional)' />
        <input name='area' placeholder='Area / Village' required />
        <select name='category' required>
            <option value=''>Select category</option>
            <option>Water</option><option>Roads/Transport</option><option>Health</option>
            <option>Education</option><option>Security</option><option>Youth/Women Opportunities</option>
            <option>Environment</option><option>Other</option>
        </select>
        <select name='urgency'><option>Normal</option><option>High</option><option>Critical</option></select>
        <textarea name='message' placeholder='Describe issue clearly' required></textarea>
        <button class='btn' type='submit'>Submit Issue</button>
    </form>
    """


def contact_page(message=""):
    return f"""
    <h1>Contact & Communication</h1>
    <ul>
      <li><b>Candidate:</b> Abraham Senteu</li>
      <li><b>Seat:</b> MCA 2027, Magadi Ward</li>
      <li><b>Official Email:</b> official@abrahamsenteu.org</li>
      <li><b>WhatsApp:</b> +254 XXX XXX XXX</li>
    </ul>
    {message}
    <section class='grid'>
      <article class='card'>
        <h3>Subscribe for Official Updates</h3>
        <form class='form' method='post' action='/subscribe'>
          <input type='email' name='email' placeholder='you@example.com' required />
          <button class='btn'>Subscribe</button>
        </form>
      </article>
      <article class='card'>
        <h3>Send a Direct Message</h3>
        <form class='form' method='post' action='/contact-message'>
          <input name='full_name' placeholder='Full name' required />
          <input name='phone' placeholder='Phone (optional)' />
          <input name='topic' placeholder='Topic' required />
          <textarea name='message' placeholder='Your message' required></textarea>
          <button class='btn'>Send Message</button>
        </form>
      </article>
    </section>
    """


def admin_page(token, flash=""):
    conn = db_conn()
    issues = query(conn, "SELECT * FROM issues ORDER BY datetime(created_at) DESC LIMIT 200")
    messages = query(conn, "SELECT * FROM contact_messages ORDER BY datetime(created_at) DESC LIMIT 100")
    conn.close()
    issue_rows = "".join(
        [
            f"<tr><td>{h(i['reference'])}</td><td>{h(i['area'])}</td><td>{h(i['category'])}</td><td>{h(i['urgency'])}</td><td>{h(i['status'])}</td><td>"
            f"<form method='post' action='/admin/issue-status' class='inline'>"
            f"<input type='hidden' name='token' value='{h(token)}'/>"
            f"<input type='hidden' name='id' value='{i['id']}'/>"
            f"<select name='status'><option>Received</option><option>Acknowledged</option><option>In Progress</option><option>Resolved</option></select>"
            f"<button class='btn tiny'>Save</button></form></td></tr>"
            for i in issues
        ]
    )
    msg_rows = "".join(
        [
            f"<tr><td>{h(m['full_name'])}</td><td>{h(m['topic'])}</td><td>{h(m['message'])}</td><td>{h(m['created_at'])}</td></tr>"
            for m in messages
        ]
    )

    return f"""
    <h1>Admin Dashboard</h1>
    {flash}
    <section class='grid'>
      <article class='card'>
        <h3>Publish New Official Update</h3>
        <form method='post' action='/admin/new-update' class='form'>
          <input type='hidden' name='token' value='{h(token)}' />
          <input name='title' placeholder='Title' required />
          <input name='category' placeholder='Category (Official Statement, Development Update...)' required />
          <input name='location' placeholder='Location' />
          <select name='status'><option>Planned</option><option>Ongoing</option><option>Completed</option></select>
          <textarea name='body' placeholder='Update content' required></textarea>
          <button class='btn'>Publish Update</button>
        </form>
      </article>
      <article class='card'>
        <h3>Add Event</h3>
        <form method='post' action='/admin/new-event' class='form'>
          <input type='hidden' name='token' value='{h(token)}' />
          <input name='title' placeholder='Event title' required />
          <input name='venue' placeholder='Venue' required />
          <input name='event_date' placeholder='YYYY-MM-DD HH:MM' required />
          <textarea name='agenda' placeholder='Agenda' required></textarea>
          <button class='btn'>Create Event</button>
        </form>
      </article>
    </section>

    <h2>Submitted Issues</h2>
    <table>
      <tr><th>Reference</th><th>Area</th><th>Category</th><th>Urgency</th><th>Status</th><th>Action</th></tr>
      {issue_rows}
    </table>

    <h2>Direct Contact Messages</h2>
    <table>
      <tr><th>Name</th><th>Topic</th><th>Message</th><th>Date</th></tr>
      {msg_rows}
    </table>
    """


def json_response(start_response, payload, status="200 OK"):
    start_response(status, [("Content-Type", "application/json; charset=utf-8")])
    return [payload.encode("utf-8")]


def redirect(start_response, location):
    start_response("302 Found", [("Location", location)])
    return [b""]


def app(environ, start_response):
    method = environ.get("REQUEST_METHOD", "GET")
    path = environ.get("PATH_INFO", "/")

    if path.startswith("/public/"):
        file_path = os.path.join(BASE_DIR, path.lstrip("/"))
        if os.path.exists(file_path) and os.path.isfile(file_path):
            ctype = "text/plain; charset=utf-8"
            if file_path.endswith(".css"):
                ctype = "text/css; charset=utf-8"
            elif file_path.endswith(".js"):
                ctype = "application/javascript; charset=utf-8"
            start_response("200 OK", [("Content-Type", ctype)])
            with open(file_path, "rb") as f:
                return [f.read()]
        start_response("404 Not Found", [("Content-Type", "text/plain; charset=utf-8")])
        return [b"Not found"]

    if path == "/" and method == "GET":
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Home", home_page())]

    if path == "/about" and method == "GET":
        content = """
        <h1>About Abraham Senteu</h1>
        <p>Abraham Senteu is building an open, people-first political leadership model for Magadi Ward where public communication is consistent and official.</p>
        <h2>Leadership Values</h2>
        <ul class='priority-list'>
          <li>Integrity and respectful leadership</li>
          <li>Timely responses to community issues</li>
          <li>Transparent progress reporting</li>
        </ul>
        """
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("About", content)]

    if path == "/manifesto" and method == "GET":
        content = """
        <h1>Manifesto & Priorities</h1>
        <div class='grid'>
          <article class='card'><h3>Water Access</h3><p>Expand and maintain water access points and coordinate drought resilience planning.</p></article>
          <article class='card'><h3>Roads & Transport</h3><p>Prioritize road maintenance for schools, clinics, and markets.</p></article>
          <article class='card'><h3>Youth Jobs</h3><p>Drive skills training and enterprise opportunities for youth.</p></article>
          <article class='card'><h3>Health & Education</h3><p>Strengthen health access and education support initiatives.</p></article>
          <article class='card'><h3>Women Empowerment</h3><p>Support safety, leadership, and local economic inclusion for women.</p></article>
          <article class='card'><h3>Accountability</h3><p>Public progress updates and community scorecards.</p></article>
        </div>
        """
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Manifesto", content)]

    if path == "/updates" and method == "GET":
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Official Updates", updates_page())]

    if path == "/events" and method == "GET":
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Events", events_page())]

    if path == "/issues" and method == "GET":
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Issues Desk", issues_form())]

    if path == "/issues" and method == "POST":
        payload = parse_post(environ)
        required = [payload.get("area"), payload.get("category"), payload.get("message")]
        if not all(required):
            start_response("400 Bad Request", [("Content-Type", "text/html; charset=utf-8")])
            msg = "<p class='flash flash-error'>Area, category, and message are required.</p>"
            return [render("Issues Desk", issues_form(msg))]

        ref = issue_reference()
        conn = db_conn()
        conn.execute(
            "INSERT INTO issues (reference, full_name, phone, area, category, urgency, message) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                ref,
                payload.get("full_name"),
                payload.get("phone"),
                payload.get("area"),
                payload.get("category"),
                payload.get("urgency") or "Normal",
                payload.get("message"),
            ),
        )
        conn.commit()
        conn.close()
        msg = f"<p class='flash flash-success'>Issue received. Your reference is <b>{h(ref)}</b>. Track at <a href='/track/{h(ref)}'>/track/{h(ref)}</a>.</p>"
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Issues Desk", issues_form(msg))]

    if path.startswith("/track/") and method == "GET":
        ref = path.split("/track/", 1)[1]
        conn = db_conn()
        issue = one(conn, "SELECT * FROM issues WHERE reference=?", (ref,))
        conn.close()
        if issue:
            content = f"""
            <h1>Issue Tracking</h1>
            <article class='card'>
              <h3>{h(issue['reference'])}</h3>
              <p><b>Area:</b> {h(issue['area'])}</p>
              <p><b>Category:</b> {h(issue['category'])}</p>
              <p><b>Status:</b> {h(issue['status'])}</p>
              <p><b>Message:</b> {h(issue['message'])}</p>
              <p><b>Updated:</b> {h(issue['updated_at'])}</p>
            </article>
            """
        else:
            content = "<h1>Issue Tracking</h1><p class='flash flash-error'>No issue found for that reference.</p>"
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Track Issue", content)]

    if path == "/media" and method == "GET":
        content = """
        <h1>Media Centre</h1>
        <div class='grid'>
          <article class='card'><h3>Photo Reports</h3><p>Field activities and community engagement records.</p></article>
          <article class='card'><h3>Video Briefings</h3><p>Short official clips with progress updates.</p></article>
          <article class='card'><h3>Press Statements</h3><p>Public clarifications and media engagement.</p></article>
        </div>
        """
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Media", content)]

    if path == "/accountability" and method == "GET":
        conn = db_conn()
        stats = one(
            conn,
            """
            SELECT
              (SELECT COUNT(*) FROM issues) AS total,
              (SELECT COUNT(*) FROM issues WHERE status='In Progress') AS in_progress,
              (SELECT COUNT(*) FROM issues WHERE status='Resolved') AS resolved,
              (SELECT COUNT(*) FROM updates) AS updates
            """,
        )
        conn.close()
        content = f"""
        <h1>Transparency Dashboard</h1>
        <section class='stats'>
          <div><strong>{stats['total']}</strong><span>Total Issues</span></div>
          <div><strong>{stats['in_progress']}</strong><span>In Progress</span></div>
          <div><strong>{stats['resolved']}</strong><span>Resolved</span></div>
          <div><strong>{stats['updates']}</strong><span>Official Updates</span></div>
        </section>
        <p>Residents can track all submitted issues by reference, and updates are published officially with timestamps.</p>
        """
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Accountability", content)]

    if path == "/contact" and method == "GET":
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Contact", contact_page())]

    if path == "/subscribe" and method == "POST":
        data = parse_post(environ)
        email = (data.get("email") or "").strip()
        if "@" not in email:
            start_response("400 Bad Request", [("Content-Type", "text/html; charset=utf-8")])
            return [render("Contact", contact_page("<p class='flash flash-error'>Please provide a valid email address.</p>"))]
        conn = db_conn()
        conn.execute("INSERT OR IGNORE INTO subscribers (email) VALUES (?)", (email,))
        conn.commit()
        conn.close()
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Contact", contact_page("<p class='flash flash-success'>Subscription received successfully.</p>"))]

    if path == "/contact-message" and method == "POST":
        data = parse_post(environ)
        if not data.get("full_name") or not data.get("topic") or not data.get("message"):
            start_response("400 Bad Request", [("Content-Type", "text/html; charset=utf-8")])
            return [render("Contact", contact_page("<p class='flash flash-error'>Name, topic, and message are required.</p>"))]
        conn = db_conn()
        conn.execute(
            "INSERT INTO contact_messages (full_name, phone, topic, message) VALUES (?, ?, ?, ?)",
            (data.get("full_name"), data.get("phone"), data.get("topic"), data.get("message")),
        )
        conn.commit()
        conn.close()
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Contact", contact_page("<p class='flash flash-success'>Your message has been received.</p>"))]

    if path == "/api/stats" and method == "GET":
        conn = db_conn()
        stats = one(
            conn,
            """
            SELECT
              (SELECT COUNT(*) FROM issues) AS total_issues,
              (SELECT COUNT(*) FROM issues WHERE status='Resolved') AS resolved_issues,
              (SELECT COUNT(*) FROM updates) AS total_updates,
              (SELECT COUNT(*) FROM subscribers) AS total_subscribers
            """,
        )
        conn.close()
        payload = (
            "{"
            f"\"total_issues\": {int(stats['total_issues'])},"
            f"\"resolved_issues\": {int(stats['resolved_issues'])},"
            f"\"total_updates\": {int(stats['total_updates'])},"
            f"\"total_subscribers\": {int(stats['total_subscribers'])}"
            "}"
        )
        return json_response(start_response, payload)

    if path == "/admin" and method == "GET":
        token = parse_qs(environ.get("QUERY_STRING", "")).get("token", [""])[0]
        if token != ADMIN_TOKEN:
            start_response("401 Unauthorized", [("Content-Type", "text/plain; charset=utf-8")])
            return [b"Unauthorized"]
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [render("Admin", admin_page(token))]

    if path == "/admin/issue-status" and method == "POST":
        data = parse_post(environ)
        if data.get("token") != ADMIN_TOKEN:
            start_response("401 Unauthorized", [("Content-Type", "text/plain; charset=utf-8")])
            return [b"Unauthorized"]
        conn = db_conn()
        conn.execute(
            "UPDATE issues SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
            (data.get("status") or "Received", data.get("id")),
        )
        conn.commit()
        conn.close()
        return redirect(start_response, f"/admin?token={ADMIN_TOKEN}")

    if path == "/admin/new-update" and method == "POST":
        data = parse_post(environ)
        if data.get("token") != ADMIN_TOKEN:
            start_response("401 Unauthorized", [("Content-Type", "text/plain; charset=utf-8")])
            return [b"Unauthorized"]
        conn = db_conn()
        conn.execute(
            "INSERT INTO updates (title, category, location, status, body) VALUES (?, ?, ?, ?, ?)",
            (
                data.get("title"),
                data.get("category"),
                data.get("location"),
                data.get("status") or "Ongoing",
                data.get("body"),
            ),
        )
        conn.commit()
        conn.close()
        return redirect(start_response, f"/admin?token={ADMIN_TOKEN}")

    if path == "/admin/new-event" and method == "POST":
        data = parse_post(environ)
        if data.get("token") != ADMIN_TOKEN:
            start_response("401 Unauthorized", [("Content-Type", "text/plain; charset=utf-8")])
            return [b"Unauthorized"]
        conn = db_conn()
        conn.execute(
            "INSERT INTO events (title, venue, event_date, agenda) VALUES (?, ?, ?, ?)",
            (data.get("title"), data.get("venue"), data.get("event_date"), data.get("agenda")),
        )
        conn.commit()
        conn.close()
        return redirect(start_response, f"/admin?token={ADMIN_TOKEN}")

    start_response("404 Not Found", [("Content-Type", "text/html; charset=utf-8")])
    return [render("Not Found", "<h1>404</h1><p>Page not found.</p>")]


if __name__ == "__main__":
    init_db()
    server = make_server("0.0.0.0", PORT, app)
    print(f"Server running on http://127.0.0.1:{PORT}")
    server.serve_forever()
