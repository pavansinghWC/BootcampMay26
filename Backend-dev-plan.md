# Backend-dev-plan.md — Growth Leap Facilitator Dashboard

---

## 1️⃣ Executive Summary

- **What:** FastAPI backend powering the Growth Leap facilitator dashboard — a 5-day cohort burnout-prevention tool for doctors
- **Why:** The frontend prototype uses hardcoded dummy data; the backend replaces every data constant with live MongoDB Atlas reads/writes
- **Constraints:**
  - FastAPI, Python 3.13, async throughout
  - MongoDB Atlas via Motor + Pydantic v2 models
  - No Docker — run with `uvicorn` directly
  - All manual testing through the frontend UI
  - Single Git branch: `main`; push after every sprint's tests pass
  - Per-task manual test required — not only at sprint end
  - API base path: `/api/v1`
- **Sprints:** S0 (setup) → S1 (auth) → S2 (cohort + doctors) → S3 (arc + engagement) → S4 (today view + posts) → S5 (quiet radar + outreach) → S6 (celebration drafter + AI) → S7 (nudge schedule + phone preview)

---

## 2️⃣ In-Scope & Success Criteria

**Features in scope (all visible in frontend):**
- Facilitator auth — signup, login, logout, `/me`
- Cohort header — name, facilitator name, current day/theme, cohort in sidebar
- Today view — active prompt display, doctor roster with In/Quiet filter, morning posts feed, today's nudge schedule timeline
- Arc view — 5-day × 2-slot engagement grid per doctor, hover tooltip text, arc KPI stats
- Doctor drawer — profile, arc mini-grid, today's post, reaction counts
- Quiet radar — detect doctors with ≥ 2 missed consecutive windows, AI-drafted 1:1 WhatsApp outreach, send/hold/unhold/undo actions, confirmation modal
- Celebration drafter — AI-drafted celebration opener, approve (schedule), edit, regenerate, unschedule, skip, tone metrics, yesterday's stats
- Phone preview — WhatsApp group thread (read-only mirror), SMS nudge previews for quiet doctor

**Out of scope (not visible in frontend):**
- Doctor self-service login
- Actual WhatsApp/SMS delivery (Periskope webhook ingestion is S0+ note only)
- Multi-cohort management UI
- Push notifications

**Success Criteria:**
- All four sidebar views (Today, Arc, Quiet Radar, Celebration) render live data from MongoDB
- All task-level manual tests pass via UI before push
- Each sprint's code committed and pushed to `main` after verification
- `/healthz` returns DB ping success
- Auth protects all `/api/v1/*` routes except `/auth/signup` and `/auth/login`

---

## 3️⃣ API Design

- **Base path:** `/api/v1`
- **Auth header:** `Authorization: Bearer <jwt>` on all routes except auth endpoints
- **Error envelope:** `{ "error": "message string" }`
- **No pagination** — cohort is fixed at ≤ 10 doctors, no list views with unbounded results

---

### Auth

- **POST /api/v1/auth/signup**
  - Purpose: create facilitator account
  - Request: `{ "email": str, "password": str, "name": str }`
  - Response: `{ "token": str, "facilitator": { "id": str, "name": str, "email": str } }`
  - Validation: email unique; password ≥ 8 chars; hash with Argon2

- **POST /api/v1/auth/login**
  - Purpose: issue JWT
  - Request: `{ "email": str, "password": str }`
  - Response: `{ "token": str, "facilitator": { "id": str, "name": str, "email": str } }`
  - Validation: verify Argon2 hash; 401 on mismatch

- **POST /api/v1/auth/logout**
  - Purpose: client-side token clear (stateless; server returns 200)
  - Response: `{ "ok": true }`

- **GET /api/v1/auth/me**
  - Purpose: return current facilitator from JWT
  - Response: `{ "id": str, "name": str, "email": str }`

---

### Cohort

- **GET /api/v1/cohort**
  - Purpose: sidebar metadata — cohort name, facilitator name, current arc day/theme
  - Response: `{ "cohort_name": str, "facilitator_name": str, "current_day": int, "current_theme": str, "program_length": int }`

- **GET /api/v1/cohort/doctors**
  - Purpose: list all 6 doctors with profile fields
  - Response: `[ { "id": str, "first": str, "last": str, "role": str, "initials": str, "years": int, "color": str } ]`

- **GET /api/v1/cohort/doctors/{doctor_id}**
  - Purpose: doctor drawer — profile + arc engagement + reaction stats + today's post
  - Response: `{ "doctor": {...}, "arc_engagement": [ [str,str], ... ], "today_post": { "text": str, "time": str } | null, "reactions_given": int, "reactions_received": int, "post_count": int }`

---

### Arc

- **GET /api/v1/arc/prompts**
  - Purpose: 5-day arc prompt definitions for column headers
  - Response: `[ { "day": int, "theme": str, "morning": str, "evening": str } ]`

- **GET /api/v1/arc/engagement**
  - Purpose: full 6×4 engagement grid for Arc view
  - Response: `{ "pr": ["✓✓","✓✓","✓ "," "], ... }` — keyed by doctor_id
  - Includes: pod_rate (int), total_possible (int), engagement_pct (int), longest_thread (str), quiet_count (int)

---

### Today

- **GET /api/v1/today**
  - Purpose: all data for Today view — active prompt, doctor states, posts feed, nudge timeline
  - Response:
    ```
    {
      "date_label": str,
      "time_label": str,
      "day": int,
      "theme": str,
      "morning_prompt": str,
      "prompt_closed_at": str,
      "morning_in_count": int,
      "morning_total": int,
      "doctor_states": { "pr": "in", "jo": "quiet", ... },
      "posts": [ { "who": str, "time": str, "text": str, "react_count": int } ],
      "nudge_timeline": [ { "time": str, "label": str, "state": str, "accent": bool, "sub": str } ]
    }
    ```

---

### Quiet Radar

- **GET /api/v1/quiet**
  - Purpose: list of doctors flagged quiet (≥2 missed windows) with outreach draft
  - Response: `[ { "doctor_id": str, "missed_count": int, "last_seen": str, "since": str, "outreach_status": str, "outreach_message": str, "nudges_fired": [str] } ]`

- **PATCH /api/v1/quiet/{doctor_id}/outreach**
  - Purpose: update outreach action — send, hold, unhold, undo
  - Request: `{ "action": "send" | "hold" | "unhold" | "undo", "message": str | null }`
  - Response: `{ "doctor_id": str, "outreach_status": str, "outreach_message": str }`
  - Validation: `action` must be one of the four values; `message` required when action is `send`

---

### Celebration

- **GET /api/v1/celebration**
  - Purpose: current celebration draft, status, yesterday's stats, tone metrics
  - Response:
    ```
    {
      "status": "drafted" | "scheduled" | "skipped",
      "draft_text": str,
      "scheduled_for": str | null,
      "yesterday_stats": { "date": str, "theme": str, "morning_participation": str, "evening_participation": str, "reactions": int, "longest_thread": str, "standout": str },
      "word_count": int
    }
    ```

- **POST /api/v1/celebration/approve**
  - Purpose: schedule draft for 6:00 AM delivery
  - Response: `{ "status": "scheduled", "scheduled_for": str }`

- **POST /api/v1/celebration/unschedule**
  - Purpose: move back to drafted
  - Response: `{ "status": "drafted" }`

- **POST /api/v1/celebration/regenerate**
  - Purpose: call Claude API, return new draft text, bump version
  - Response: `{ "status": "drafted", "draft_text": str, "version": int }`

- **POST /api/v1/celebration/skip**
  - Purpose: mark no message today
  - Response: `{ "status": "skipped" }`

- **PATCH /api/v1/celebration/draft**
  - Purpose: save facilitator manual edits to draft text
  - Request: `{ "text": str }`
  - Response: `{ "status": "drafted", "draft_text": str, "word_count": int }`

---

### Phone Preview

- **GET /api/v1/preview/whatsapp**
  - Purpose: read-only WhatsApp group thread messages
  - Response: `[ { "kind": "system"|"fac"|"msg"|"react", "who": str | [str], "time": str | null, "text": str | null, "emoji": str | null } ]`

- **GET /api/v1/preview/sms/{doctor_id}**
  - Purpose: SMS nudge previews for a specific doctor's lock screen
  - Response: `{ "reminder_text": str, "reminder_time": str, "reminder_state": str, "social_text": str, "social_time": str, "social_state": str }`

---

### Health

- **GET /healthz**
  - Purpose: DB ping + app status
  - Response: `{ "status": "ok", "db": "connected" | "error", "env": str }`

---

## 4️⃣ Data Model (MongoDB Atlas)

---

### Collection: `facilitators`

- `_id`: ObjectId, auto
- `email`: str, required, unique
- `name`: str, required
- `hashed_password`: str, required
- `created_at`: datetime, default now

```json
{
  "_id": "665abc...",
  "email": "sana@growthleak.io",
  "name": "Sana Ahmadi",
  "hashed_password": "$argon2id$...",
  "created_at": "2026-05-20T08:00:00Z"
}
```

---

### Collection: `cohorts`

- `_id`: ObjectId
- `facilitator_id`: str, ref facilitators
- `name`: str, required
- `current_day`: int, 1–5, required
- `program_length`: int, default 5
- `start_date`: date, required
- `doctors`: embedded list of doctor objects (see below)

```json
{
  "_id": "665def...",
  "facilitator_id": "665abc...",
  "name": "Pacific Mercy · Hospitalist Pod 2",
  "current_day": 3,
  "program_length": 5,
  "start_date": "2026-05-20",
  "doctors": [
    { "id": "pr", "first": "Priya", "last": "Raghavan", "role": "Hospitalist", "initials": "PR", "years": 9, "color": "#B5733F" }
  ]
}
```

---

### Collection: `arc_prompts`

- `_id`: ObjectId
- `cohort_id`: str
- `day`: int, 1–5
- `theme`: str
- `morning`: str
- `evening`: str

```json
{
  "_id": "...",
  "cohort_id": "665def...",
  "day": 3,
  "theme": "Reaching",
  "morning": "Who on this team could use one sentence from you today? Commit to it here.",
  "evening": "Did you reach? What happened — or what got in the way?"
}
```

---

### Collection: `posts`

- `_id`: ObjectId
- `cohort_id`: str
- `doctor_id`: str
- `day`: int
- `slot`: str — `"morning"` | `"evening"`
- `text`: str
- `posted_at`: datetime
- `react_count`: int, default 0

```json
{
  "_id": "...",
  "cohort_id": "665def...",
  "doctor_id": "sr",
  "day": 3,
  "slot": "morning",
  "text": "Going to tell Dr. Chen I noticed how he handled the family in 412.",
  "posted_at": "2026-05-22T06:42:00Z",
  "react_count": 4
}
```

---

### Collection: `engagement`

- `_id`: ObjectId
- `cohort_id`: str
- `doctor_id`: str
- `day`: int
- `morning_status`: str — `"posted"` | `"skipped"` | `"pending"`
- `evening_status`: str — `"posted"` | `"skipped"` | `"pending"`
- `last_active_at`: datetime | null

```json
{
  "_id": "...",
  "cohort_id": "665def...",
  "doctor_id": "jo",
  "day": 2,
  "morning_status": "posted",
  "evening_status": "skipped",
  "last_active_at": "2026-05-21T19:14:00Z"
}
```

---

### Collection: `outreach`

- `_id`: ObjectId
- `cohort_id`: str
- `doctor_id`: str
- `day`: int
- `status`: str — `"drafted"` | `"sending"` | `"sent"` | `"held"`
- `message`: str
- `updated_at`: datetime

```json
{
  "_id": "...",
  "cohort_id": "665def...",
  "doctor_id": "jo",
  "day": 3,
  "status": "drafted",
  "message": "Hey James — no need to respond to this…",
  "updated_at": "2026-05-22T11:00:00Z"
}
```

---

### Collection: `celebration_drafts`

- `_id`: ObjectId
- `cohort_id`: str
- `day`: int
- `status`: str — `"drafted"` | `"scheduled"` | `"skipped"`
- `draft_text`: str
- `version`: int, default 1
- `scheduled_for`: datetime | null
- `updated_at`: datetime

```json
{
  "_id": "...",
  "cohort_id": "665def...",
  "day": 3,
  "status": "drafted",
  "draft_text": "Good morning, Pod 2.\n\nYesterday you named things...",
  "version": 2,
  "scheduled_for": null,
  "updated_at": "2026-05-22T05:42:00Z"
}
```

---

### Collection: `nudges`

- `_id`: ObjectId
- `cohort_id`: str
- `doctor_id`: str
- `day`: int
- `type`: str — `"reminder"` | `"social"`
- `scheduled_for`: datetime
- `fired_at`: datetime | null
- `status`: str — `"pending"` | `"fired"` | `"queued"`
- `text`: str

```json
{
  "_id": "...",
  "cohort_id": "665def...",
  "doctor_id": "jo",
  "day": 3,
  "type": "reminder",
  "scheduled_for": "2026-05-22T09:45:00Z",
  "fired_at": "2026-05-22T09:45:12Z",
  "status": "fired",
  "text": "Growth Leap: Day 3 morning prompt closes in 15 min. One sentence is plenty. Open WhatsApp →"
}
```

---

## 5️⃣ Frontend Audit & Feature Map

---

**Sidebar (always visible)**
- Route: persistent layout component
- Data needed: cohort name, facilitator name, current day/theme, quiet badge count
- Endpoint: `GET /api/v1/cohort`, `GET /api/v1/quiet` (for badge)
- Auth: required

---

**Today view** (`route === "today"`)
- Purpose: morning snapshot — who posted, who's quiet, nudge timeline
- Data needed: date/time, active prompt, doctor states, posts, nudge schedule
- Endpoint: `GET /api/v1/today`
- Doctor row click → opens DoctorDrawer → `GET /api/v1/cohort/doctors/{id}`
- Auth: required
- Note: filter pills (All/In/Quiet) computed client-side from `doctor_states`

---

**Arc view** (`route === "arc"`)
- Purpose: 5-day engagement grid, per-doctor and pod KPIs
- Data needed: all doctors, engagement grid, arc prompts for column labels, KPI stats
- Endpoints: `GET /api/v1/arc/engagement`, `GET /api/v1/arc/prompts`
- Doctor row click → opens DoctorDrawer
- Cell hover tooltip → text from posts or engagement status label (computed from `posts` + `engagement`)
- Auth: required

---

**Quiet Radar view** (`route === "quiet"`)
- Purpose: flagged doctors + AI-drafted 1:1 outreach actions
- Data needed: quiet doctor(s), pattern description, outreach message + status, nudge history
- Endpoints: `GET /api/v1/quiet`, `PATCH /api/v1/quiet/{doctor_id}/outreach`
- Doctor card click → opens DoctorDrawer
- Actions: Send, Edit (local state), Hold off, Undo
- Confirmation modal before Send → fires PATCH with `action: "send"`
- Auth: required

---

**Celebration view** (`route === "celebration"`)
- Purpose: approve/edit/regenerate AI celebration opener for next day 6:00 AM
- Data needed: draft text, status, yesterday stats, tone metrics
- Endpoints: `GET /api/v1/celebration`, `POST /api/v1/celebration/approve`, `POST /api/v1/celebration/regenerate`, `POST /api/v1/celebration/unschedule`, `POST /api/v1/celebration/skip`, `PATCH /api/v1/celebration/draft`
- Tone check (word count, constraint flags) can be computed client-side or returned by server on GET/PATCH
- Auth: required

---

**Doctor Drawer** (slide-in panel)
- Purpose: individual doctor detail — arc grid, today post, quiet alert, reactions
- Endpoint: `GET /api/v1/cohort/doctors/{doctor_id}`
- Auth: required

---

**Phone Drawer** ("What doctors see")
- Purpose: read-only preview of WhatsApp group thread + SMS lock screen for quiet doctor
- Endpoints: `GET /api/v1/preview/whatsapp`, `GET /api/v1/preview/sms/{doctor_id}`
- Auth: required
- Note: frontend shows tabs (WhatsApp / SMS · James's lock screen); SMS tab always shows first quiet doctor

---

## 6️⃣ Configuration & ENV Vars

- `APP_ENV` — `development` | `production`
- `PORT` — HTTP port, default `8000`
- `MONGODB_URI` — MongoDB Atlas connection string, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/growthleak`
- `JWT_SECRET` — token signing key, min 32 chars
- `JWT_EXPIRES_IN` — seconds before JWT expiry, default `86400` (24h)
- `CORS_ORIGINS` — comma-separated frontend URL(s), e.g. `http://localhost:5500,http://127.0.0.1:5500`
- `ANTHROPIC_API_KEY` — Claude API key for celebration regenerate and quiet outreach drafting

---

## 7️⃣ Background Work

- **Celebration scheduled delivery** — `status === "scheduled"` means the facilitator approved; actual WhatsApp send is out of scope for MVP; backend stores `scheduled_for` datetime; frontend reads status and shows "ships at 6:00 AM"
- **No background task runner required** — no Celery, no queues; nudge firing is stored in `nudges` collection and status is read by the frontend; actual SMS delivery is deferred to Periskope integration (future)

---

## 8️⃣ Integrations

**Claude API (Anthropic) — for AI drafting**
- Used in: `POST /api/v1/celebration/regenerate` and initial quiet outreach message seeding
- Flow: build prompt from yesterday's stats + engagement data → call `claude-sonnet-4-6` → return draft text
- Extra env var: `ANTHROPIC_API_KEY`
- Constraints injected into prompt: ≤80 words, group-level only, no individual callouts, ends with facilitator initial

**Periskope (WhatsApp CRM) — read-only mirror**
- Used in: `GET /api/v1/preview/whatsapp` and `GET /api/v1/today` (posts feed)
- MVP approach: seed posts from mock data into `posts` collection; real Periskope webhook ingestion is post-MVP
- No extra env var needed for MVP

---

## 9️⃣ Testing Strategy (Manual via Frontend)

- All validation through frontend UI — no automated test suite
- Every task below includes a **Manual Test Step** and a **User Test Prompt**
- After all tasks in a sprint pass their tests → commit and push to `main`
- If any test fails → fix and retest before pushing

---

## 🔟 Sprint Plan & Backlog

---

## 🧱 S0 — Environment Setup & Project Skeleton

**Objectives:**
- Create FastAPI project structure
- Connect to MongoDB Atlas
- `/healthz` endpoint with DB ping
- Enable CORS for frontend
- Initialize Git at project root, push to GitHub on `main`
- Single `.gitignore` at root

**User Stories:**
- As a developer I can run the backend locally and confirm MongoDB Atlas is connected
- As a developer I can see the repo live on GitHub

**Tasks:**

**Task S0.1 — Project scaffold**
- Create `backend/` directory inside repo root
- Create `backend/main.py` with FastAPI app, `backend/requirements.txt`, `backend/.env.example`
- `requirements.txt`: `fastapi`, `uvicorn[standard]`, `motor`, `pydantic[email]`, `pydantic-settings`, `python-jose[cryptography]`, `argon2-cffi`, `anthropic`, `python-dotenv`
- Create `backend/config.py` loading all ENV vars via Pydantic `BaseSettings`
- Create `backend/database.py` initializing Motor `AsyncIOMotorClient` from `MONGODB_URI`
- Manual Test Step: Run `uvicorn main:app --reload` from `backend/` — terminal shows no errors
- User Test Prompt: "Start the backend with `uvicorn main:app --reload` inside the `backend/` folder. Confirm the terminal shows 'Application startup complete' with no errors."

**Task S0.2 — `/healthz` endpoint**
- Add `GET /healthz` route in `main.py`
- Ping MongoDB Atlas: `await db.command("ping")`
- Return `{ "status": "ok", "db": "connected", "env": "development" }` on success; `{ "status": "ok", "db": "error" }` on failure
- Manual Test Step: Open `http://localhost:8000/healthz` in browser — see JSON with `"db": "connected"`
- User Test Prompt: "With the backend running, open `http://localhost:8000/healthz` in your browser. You should see `{\"status\": \"ok\", \"db\": \"connected\"}`."

**Task S0.3 — CORS**
- Add `CORSMiddleware` in `main.py` using `CORS_ORIGINS` from config
- Manual Test Step: Open `Growth Leap - Prototype.html` from the filesystem in a browser — open DevTools Network tab, confirm no CORS errors on any backend request
- User Test Prompt: "Open the prototype HTML file in a browser. Open DevTools → Network. Refresh. Confirm there are no red CORS-related errors."

**Task S0.4 — Git + .gitignore**
- Create `.gitignore` at repo root: `__pycache__/`, `*.pyc`, `.env`, `*.egg-info/`, `.venv/`, `node_modules/`
- Commit all files: `git add -A && git commit -m "S0: FastAPI skeleton, MongoDB Atlas, healthz, CORS"`
- Push to `main` on GitHub
- Manual Test Step: Visit GitHub repo — confirm `backend/` folder and `.gitignore` are visible
- User Test Prompt: "Open your GitHub repo in a browser. Confirm you can see the `backend/` folder and a `.gitignore` file in the root."

**Definition of Done:**
- Backend runs locally, `/healthz` returns `"db": "connected"`
- CORS allows frontend origin
- Repo is live on GitHub `main` with `.gitignore`

---

## 🧩 S1 — Facilitator Auth (Signup / Login / Logout / Me)

**Objectives:**
- JWT-based auth for facilitators
- Protect all `/api/v1/*` routes except auth endpoints

**User Stories:**
- As Sana I can create an account and log in
- As Sana I can log out and be blocked from protected pages

**Tasks:**

**Task S1.1 — Facilitators collection + Pydantic models**
- Create `backend/models/facilitator.py` with `FacilitatorDoc` (Pydantic v2, MongoDB document)
- Fields: `id` (alias `_id`), `email`, `name`, `hashed_password`, `created_at`
- Create `backend/routers/auth.py` with APIRouter prefix `/api/v1/auth`
- Manual Test Step: No UI test yet — confirm app starts without import errors
- User Test Prompt: "Restart the backend. Confirm the terminal shows no import errors and `http://localhost:8000/healthz` still returns 200."

**Task S1.2 — POST /api/v1/auth/signup**
- Hash password with `argon2-cffi`
- Insert into `facilitators` collection
- Return JWT + facilitator object
- 409 if email already exists
- Manual Test Step: Open the prototype HTML — add a temporary sign-up form or use `curl`; verify a new document appears in MongoDB Atlas UI under `facilitators`
- User Test Prompt: "Run: `curl -X POST http://localhost:8000/api/v1/auth/signup -H 'Content-Type: application/json' -d '{\"email\":\"sana@test.com\",\"password\":\"password123\",\"name\":\"Sana\"}'`. Confirm you get back a JSON with a `token` field."

**Task S1.3 — POST /api/v1/auth/login**
- Verify Argon2 hash
- Issue JWT signed with `JWT_SECRET`, expiry = `JWT_EXPIRES_IN`
- 401 on wrong password
- Manual Test Step: Log in with the account created in S1.2 — confirm token returned
- User Test Prompt: "Run: `curl -X POST http://localhost:8000/api/v1/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"sana@test.com\",\"password\":\"password123\"}'`. Confirm you get a `token`."

**Task S1.4 — JWT dependency + GET /api/v1/auth/me**
- Create `backend/dependencies.py` with `get_current_facilitator` FastAPI dependency
- Decode JWT, look up facilitator in DB, raise 401 if invalid/expired
- Add `GET /api/v1/auth/me` using the dependency
- Manual Test Step: Call `/api/v1/auth/me` with the token in the Authorization header — confirm facilitator data returned
- User Test Prompt: "Run: `curl http://localhost:8000/api/v1/auth/me -H 'Authorization: Bearer <your_token>'`. Confirm you see your name and email."

**Task S1.5 — POST /api/v1/auth/logout**
- Return `{ "ok": true }` — client clears token; no server session
- Manual Test Step: Call `/api/v1/auth/logout` with a valid token — confirm 200
- User Test Prompt: "Run: `curl -X POST http://localhost:8000/api/v1/auth/logout -H 'Authorization: Bearer <your_token>'`. Confirm `{\"ok\": true}`."

**Definition of Done:**
- Signup, login, logout, me all work via curl
- JWT dependency blocks unauthenticated requests with 401
- Push to `main`

---

## 🧩 S2 — Cohort + Doctor Data (Seed + Read)

**Objectives:**
- Seed MongoDB Atlas with the 6-doctor cohort from `data.jsx`
- Serve cohort metadata, doctor list, and individual doctor profiles

**User Stories:**
- As Sana I see my cohort name and current arc day in the sidebar
- As Sana I can click any doctor to see their profile

**Tasks:**

**Task S2.1 — Seed script**
- Create `backend/seed.py` — idempotent script (upsert by cohort name)
- Seeds: `cohorts` (1 doc), `arc_prompts` (5 docs), `facilitators` (1 doc for Sana), `engagement` (6 doctors × days 1–3 with statuses from `GL_ENGAGEMENT`), `posts` (5 docs from `GL_TODAY_POSTS`), `outreach` (1 doc for James, status `"drafted"`), `celebration_drafts` (1 doc, status `"drafted"`), `nudges` (2 docs for James day 3)
- Manual Test Step: Run `python seed.py` — confirm terminal shows "Seeded successfully" and Atlas UI shows the documents
- User Test Prompt: "Run `python seed.py` from the `backend/` folder. Open MongoDB Atlas, navigate to your database, and confirm `cohorts`, `arc_prompts`, and `posts` collections each have documents."

**Task S2.2 — GET /api/v1/cohort**
- Create `backend/routers/cohort.py`
- Return cohort name, facilitator name, current_day, current_theme (from `arc_prompts`), program_length
- Manual Test Step: Call endpoint with JWT — confirm correct cohort name and day 3 / "Reaching"
- User Test Prompt: "Run: `curl http://localhost:8000/api/v1/cohort -H 'Authorization: Bearer <token>'`. Confirm you see `\"current_day\": 3` and `\"current_theme\": \"Reaching\"`."

**Task S2.3 — GET /api/v1/cohort/doctors**
- Return array of 6 doctors from embedded `cohorts.doctors`
- Manual Test Step: Call endpoint — confirm all 6 doctors returned with correct fields
- User Test Prompt: "Run: `curl http://localhost:8000/api/v1/cohort/doctors -H 'Authorization: Bearer <token>'`. Confirm 6 doctors are listed with `first`, `last`, `color` fields."

**Task S2.4 — GET /api/v1/cohort/doctors/{doctor_id} (Doctor Drawer)**
- Aggregate: doctor profile + arc engagement (all days) + today's post + reaction stats
- Arc engagement: read `engagement` collection → convert to `["✓✓","✓✓","✓ "," "]` format matching frontend expectation
- Today's post: query `posts` where `day=current_day, slot="morning", doctor_id=id`
- Reaction stats: hardcoded computation from engagement counts (posts made, reactions given/received) — same logic as frontend dummy data
- Manual Test Step: Click any doctor row in Today view — confirm drawer opens with correct name, arc grid, and today's post text
- User Test Prompt: "Open the prototype in a browser (with frontend pointed to the backend). Click on 'Priya Raghavan' in Today view. Confirm the drawer shows her name, a filled arc grid, and her morning post."

**Definition of Done:**
- Sidebar shows "Pacific Mercy · Hospitalist Pod 2" and "Sana Ahmadi"
- Doctor drawer opens with live data
- Push to `main`

---

## 🧩 S3 — Arc View + Engagement Grid

**Objectives:**
- Serve Arc view data — full engagement grid, arc prompt labels, pod KPIs

**User Stories:**
- As Sana I see the 5-day engagement grid for all 6 doctors with correct filled/empty/skipped cells
- As Sana I see pod engagement rate and quiet count in Arc KPIs

**Tasks:**

**Task S3.1 — GET /api/v1/arc/prompts**
- Query all 5 `arc_prompts` docs for the cohort, return sorted by `day`
- Manual Test Step: Call endpoint — confirm 5 items with correct theme names (Noticing → Carrying it)
- User Test Prompt: "Run: `curl http://localhost:8000/api/v1/arc/prompts -H 'Authorization: Bearer <token>'`. Confirm 5 days returned with theme `\"Reaching\"` on day 3."

**Task S3.2 — GET /api/v1/arc/engagement**
- For each doctor: query `engagement` collection for all days 1–current_day
- Build engagement string format: `"✓"` if posted, `"·"` if skipped, `" "` if pending/future
- Compute: `pod_rate` (total posts / total possible through today), `engagement_pct`, `longest_thread` (from celebration stats), `quiet_count` (doctors with ≥2 missed windows)
- Manual Test Step: Navigate to Arc view in prototype — confirm grid fills correctly, James has two `"·"` cells visible, KPIs show 27/30 and 90%
- User Test Prompt: "Open the prototype and navigate to 'Arc'. Confirm the grid shows filled rust cells for 5 of 6 doctors, James (JO) row has two outlined/hollow cells, and the top-right shows 90% engagement."

**Task S3.3 — Arc hover tooltips**
- `GET /api/v1/cohort/doctors/{id}` already returns posts; arc hover data can be derived from posts collection in the arc engagement endpoint by embedding post text per day/slot
- Add `post_excerpts` field to engagement response: `{ "jo": { "3_morning": null, "2_morning": "...", ... } }`
- Manual Test Step: Hover over a filled arc cell in Arc view — confirm tooltip shows the actual post text
- User Test Prompt: "In Arc view, hover your mouse over the filled Day 3 morning cell for Sofía Restrepo. Confirm a tooltip appears with text about Dr. Chen and the family in 412."

**Definition of Done:**
- Arc view renders live engagement grid matching the mock data shape
- Hover tooltips show post text for Day 3 morning
- Push to `main`

---

## 🧩 S4 — Today View + Posts Feed

**Objectives:**
- Serve all Today view data from a single endpoint

**User Stories:**
- As Sana I see this morning's active prompt, which doctors posted, the posts feed, and today's nudge timeline

**Tasks:**

**Task S4.1 — GET /api/v1/today**
- Build response from: `cohorts.current_day`, current `arc_prompts` doc, `engagement` for today (doctor states), `posts` for today's morning (posts feed + react_count), `nudges` for today (timeline)
- `doctor_states` map: a doctor is `"quiet"` if they have ≥1 skipped window in last 2 days; otherwise `"in"` if they posted this morning; `"pending"` otherwise — use `"in"` vs `"quiet"` to match frontend
- `nudge_timeline`: 4 items (prompt open, reminder SMS, social nudge, evening prompt) — derive state (`past`/`live`/`future`) from current time vs scheduled times
- Manual Test Step: Open Today view in prototype — confirm correct date, prompt text "Who on this team…", 5 of 6 morning count, all 5 posts appear, nudge timeline shows 4 items
- User Test Prompt: "Open the prototype in a browser and navigate to 'Today'. Confirm: (1) the morning prompt reads 'Who on this team…', (2) the top-right shows 5/6, (3) all 5 posts appear in the right column with timestamps, (4) the nudge timeline shows 4 rows at the bottom."

**Task S4.2 — Doctor roster filter**
- Filter pills (All/In/Quiet) work client-side using `doctor_states` from the response
- Verify the filter works correctly with live data
- Manual Test Step: Click "Quiet" filter pill in Today view — confirm only James Okafor row appears
- User Test Prompt: "In Today view, click the 'Quiet 1' filter pill. Confirm only James Okafor appears in the roster."

**Definition of Done:**
- Today view shows all live data — prompt, roster, posts feed, nudge timeline
- Filter pills work correctly
- Push to `main`

---

## 🧩 S5 — Quiet Radar + Outreach Actions

**Objectives:**
- Detect quiet doctors and serve AI-drafted outreach messages
- Enable Send / Hold / Undo actions that persist to MongoDB

**User Stories:**
- As Sana I see James flagged as quiet with the drafted 1:1 message
- As Sana I can send, hold, undo the outreach and see the status update in the UI

**Tasks:**

**Task S5.1 — GET /api/v1/quiet**
- Query `engagement` to find doctors with ≥2 missed windows (skipped) in last 3 days
- For each quiet doctor: include missed_count, last_seen, since, outreach document (status + message), nudges fired today
- Manual Test Step: Call endpoint — confirm James is returned with `"outreach_status": "drafted"` and the pre-seeded message text
- User Test Prompt: "Run: `curl http://localhost:8000/api/v1/quiet -H 'Authorization: Bearer <token>'`. Confirm James Okafor appears with `outreach_status: 'drafted'` and a non-empty `outreach_message`."

**Task S5.2 — Quiet Radar badge in sidebar**
- `GET /api/v1/quiet` count returned with cohort data OR frontend fetches both; sidebar badge shows count if `status !== "sent"`
- Manual Test Step: Open prototype — confirm sidebar "Quiet radar" item shows a `1` badge in the top right
- User Test Prompt: "Open the prototype. In the left sidebar, confirm the 'Quiet radar' nav item has a small badge reading '1'."

**Task S5.3 — PATCH /api/v1/quiet/{doctor_id}/outreach — Send action**
- On `action: "send"`: update `outreach.status` to `"sent"`, set `updated_at`
- Return updated outreach object
- Manual Test Step: In Quiet Radar view, click "Send privately" → confirm modal → click "Send to James" → confirm chip changes to "Sent · just now" and toast appears
- User Test Prompt: "Navigate to 'Quiet radar'. Click 'Send privately', then confirm the modal appears. Click 'Send to James'. Confirm the status chip changes to 'Sent · just now' and a toast notification briefly appears."

**Task S5.4 — PATCH /api/v1/quiet/{doctor_id}/outreach — Hold + Unhold + Undo**
- `action: "hold"` → status `"held"`
- `action: "unhold"` → status `"drafted"`
- `action: "undo"` → status `"drafted"` (same as unhold, for after-send undo)
- Manual Test Step: Click "Hold off" — confirm chip changes to "Held off". Click "Resume draft" — confirm chip returns to "Not sent"
- User Test Prompt: "In Quiet Radar, click 'Hold off'. Confirm the chip reads 'Held off'. Then click 'Resume draft'. Confirm the message draft and action buttons return."

**Task S5.5 — Edit outreach message**
- Edit happens client-side in textarea; `PATCH /api/v1/quiet/{doctor_id}/outreach` with `action: "save_edit"` and `message: str` persists the edit
- Manual Test Step: Click "Edit", change one word in the message, click "Save edits", refresh the page — confirm the edited message persists
- User Test Prompt: "In Quiet Radar, click 'Edit', change one word in the message, click 'Save edits'. Refresh the page. Confirm the message still shows your edited version."

**Definition of Done:**
- Quiet doctor detected and displayed live
- Send/Hold/Undo all persist to MongoDB and reflect in UI
- Push to `main`

---

## 🧩 S6 — Celebration Drafter + Claude AI Integration

**Objectives:**
- Serve the celebration draft and yesterday's stats
- Implement Approve / Regenerate / Edit / Skip / Unschedule
- `Regenerate` calls Claude API

**User Stories:**
- As Sana I see the AI-drafted celebration opener with tone check
- As Sana I can regenerate a new draft using Claude
- As Sana I can approve it (schedule for 6:00 AM) or skip

**Tasks:**

**Task S6.1 — GET /api/v1/celebration**
- Read `celebration_drafts` doc for current day
- Compute `word_count` server-side
- Pull yesterday's stats: sum posts, reactions, thread length from `posts` + `engagement` for `day = current_day - 1`
- Return full response including `yesterday_stats` and `word_count`
- Manual Test Step: Navigate to Celebration view — confirm draft text, word count, yesterday's stats (6/6 morning, 5/6 evening, 23 reactions, standout text) all appear
- User Test Prompt: "Open the prototype and navigate to 'Celebration'. Confirm: (1) the draft message appears in the left panel, (2) the word count shows '≤80 words', (3) the right panel shows 'Morning posts: 6/6' and 'Evening posts: 5/6'."

**Task S6.2 — PATCH /api/v1/celebration/draft (Edit)**
- Update `draft_text` in `celebration_drafts` collection
- Return updated `word_count`
- Manual Test Step: Click "Edit" in Celebration view, change one sentence, click "Save edits" — confirm edited text persists after page refresh
- User Test Prompt: "In Celebration view, click 'Edit', change one sentence, click 'Save edits'. Refresh the page. Confirm your edit persisted."

**Task S6.3 — POST /api/v1/celebration/regenerate (Claude API)**
- Build prompt from yesterday's stats + arc theme + constraints (≤80 words, group-level, no callouts, ends with facilitator initial)
- Call `anthropic` SDK: `client.messages.create(model="claude-sonnet-4-6", max_tokens=300, messages=[...])`
- Update `celebration_drafts.draft_text`, increment `version`, keep `status = "drafted"`
- Return `{ "status": "drafted", "draft_text": str, "version": int }`
- Manual Test Step: Click "Regenerate" in Celebration view — confirm the loading state ("Re-reading yesterday's thread…") appears, then new draft text replaces the old one
- User Test Prompt: "In Celebration view, click 'Regenerate'. Confirm a pulsing 'Re-reading yesterday's thread…' overlay appears, then disappears and replaces the draft text with a new message."

**Task S6.4 — POST /api/v1/celebration/approve**
- Set `status = "scheduled"`, `scheduled_for = tomorrow 06:00 AM local`
- Manual Test Step: Click "Approve · ships tomorrow 6:00" — confirm chip changes to "Scheduled · 6:00 AM" and the confirmation message appears below the draft
- User Test Prompt: "In Celebration view, click 'Approve · ships tomorrow 6:00'. Confirm the status chip changes to 'Scheduled · 6:00 AM' and the text 'Will ship tomorrow at 6:00 AM with Day 4 prompt' appears."

**Task S6.5 — POST /api/v1/celebration/unschedule + skip**
- `unschedule`: set `status = "drafted"`, clear `scheduled_for`
- `skip`: set `status = "skipped"`
- Manual Test Step: After approving, click "Unschedule" — confirm draft state returns. Then click "Skip today" — confirm toast appears
- User Test Prompt: "After approving, click 'Unschedule'. Confirm the approve/edit/regenerate buttons reappear. Then click 'Skip today' — confirm a toast saying 'Skipped today' briefly appears."

**Definition of Done:**
- Celebration view fully functional with live data
- Claude regeneration returns a real AI draft
- Approve/unschedule persists correctly
- Push to `main`

---

## 🧩 S7 — Phone Preview (WhatsApp Thread + SMS)

**Objectives:**
- Serve the "What doctors see" phone drawer content from live data

**User Stories:**
- As Sana I can open "What doctors see" and read the WhatsApp thread mirroring today's posts
- As Sana I can switch to the SMS tab and see James's nudge lock screen

**Tasks:**

**Task S7.1 — GET /api/v1/preview/whatsapp**
- Build message list from: cohort facilitator opening message (Day 3 morning), today's posts in posted_at order, reaction events (combined from engagement)
- Map message kinds: `"system"` (day header), `"fac"` (Sana's opener), `"msg"` (doctor posts), `"react"` (reaction line)
- Manual Test Step: Open prototype, click "What doctors see" button in top-right — confirm WhatsApp phone panel slides in with Sana's opening message followed by all 5 doctor posts in time order
- User Test Prompt: "Open the prototype. Click 'What doctors see' (top-right button). Confirm the phone panel opens on WhatsApp tab. You should see Sana's opening message at the top, then posts from Sofía (6:42), Priya (7:11), Marcus (7:48), Hannah (8:02), Daniel (9:23)."

**Task S7.2 — GET /api/v1/preview/sms/{doctor_id}**
- Return reminder + social nudge texts and states from `nudges` collection for the given doctor and current day
- Manual Test Step: Click "What doctors see", switch to "SMS · James's lock screen" tab — confirm two nudge notifications appear (Reminder "now" + Social "queued")
- User Test Prompt: "In the 'What doctors see' panel, click the 'SMS · James's lock screen' tab. Confirm two notification bubbles appear — one labeled 'Reminder nudge · 15 min before close' and one labeled 'Queued · 11:00 AM · Social nudge'."

**Definition of Done:**
- Both phone preview tabs show live data
- All 7 sprints complete, all tests pass
- Final push to `main`
- Every frontend view functional end-to-end with MongoDB Atlas data

---

## ✅ Post-Build Checklist

- All `/api/v1/*` routes require valid JWT (tested by calling without token → 401)
- `/healthz` returns `"db": "connected"` on live Atlas connection
- `.env` is in `.gitignore` and never committed
- `seed.py` is idempotent (safe to run multiple times without duplicating data)
- All celebration drafts and outreach actions persist across page refresh
- Claude API key present in `.env` only
