# Login Flow (Frontend + Backend)

A fictional brand built to demo a full login flow: React + Vite
frontend, Express backend, mock credential checking, no database, no real
brand resemblance.

## 1. Run it (two terminals)

**Terminal 1 — backend**
```bash
cd backend
npm install
npm run dev        # http://localhost:5000
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
npm run dev         # http://localhost:5173
```

The frontend already points at `http://localhost:5000` by default
(`VITE_API_URL` in `.env.example`). Copy it to `.env` if you want to change
the backend URL.

## 2. Try it
Any other combination returns "Invalid email or password." from the backend.

## 3. Project structure

```
login-app/
├── backend/
│   ├── server.js          Express app, /api/login + /api/health
│   ├── data/users.js       hardcoded mock "database"
│   └── package.json
└── frontend/
    ├── vite.config.js       Vite + Tailwind v4 plugin, no postcss.config.js
    ├── src/
    │   ├── main.jsx           mounts <App /> inside <BrowserRouter>
    │   ├── App.jsx              routes: /login, /dashboard (protected)
    │   ├── utils/validation.js   client-side field validation rules
    │   ├── components/ProtectedRoute.jsx   redirects to /login if no token
    │   └── pages/
    │       ├── Login.jsx          brand panel + form + axios call
    │       └── Dashboard.jsx       dummy post-login page
    └── package.json
```

## 4. How the flow works, end to end

1. **Typing** — `Login.jsx` keeps `email`/`password` in `useState`. Each
   keystroke also clears that field's error, so mistakes disappear as soon
   as the user starts fixing them instead of lingering until re-submit.
2. **Submit → client validation** — `validateLoginForm()` checks:
   - both fields non-empty
   - email matches a basic `name@domain.tld` pattern
   - password is at least 6 characters
   If anything fails, errors render inline under the relevant field and
   **no network request is sent** — the wrong-shaped input is caught before
   it costs a round trip.
3. **Axios POST** — valid input goes to `POST {VITE_API_URL}/api/login` as
   JSON.
4. **Backend re-validates independently** — `server.js` checks the same
   rules again server-side. This isn't redundant: a backend must never
   trust that a request actually came through the frontend's form (someone
   could hit the API directly with curl/Postman), so it always re-checks.
5. **Credential check** — the backend looks up the email in the mock
   `users` array and compares the password. Match → `200` with a token +
   user object. No match → `401` with a deliberately generic "Invalid email
   or password" (not "no such email"), which is standard practice so the
   API doesn't reveal which registered emails exist.
6. **Frontend handles the response**:
   - Success → token + user saved to `localStorage`, then
     `navigate('/dashboard')`.
   - `401`/`400` → the backend's message is shown in a red banner above the
     submit button.
   - No response at all (backend not running, network down) → a distinct
     "Could not reach the server" message, so that failure mode isn't
     confused with a wrong password.
7. **Protected route** — `/dashboard` is wrapped in `<ProtectedRoute>`,
   which checks for the token in `localStorage`. No token → immediate
   redirect back to `/login`, so the dummy dashboard can't be reached by
   just typing the URL without logging in first.
8. **Logout** — clears `localStorage` and navigates back to `/login`.

## 5. Why "Solace" and not a real brand

The brief specifically asked not to clone existing login pages (Netflix,
Instagram, Spotify, etc.) — real UI clones can get flagged as phishing
lookalikes if ever deployed, and don't show original design thinking to
anyone reviewing the project. "Solace" here is an invented, generic
productivity-app identity: original wordmark, original color palette (deep
charcoal + teal, rather than any real brand's colors), original copy. Treat
the name/style as a placeholder — swap it for your own branding freely.

## 6. Security notes (this is a demo, not production-ready)

- Passwords are stored in **plain text** in `data/users.js` — a real app
  would hash them (bcrypt/argon2) before they ever touch storage.
- The "token" is a base64 string, not a signed JWT — anyone can forge one.
  A real app would use `jsonwebtoken` with a secret, or server-side
  sessions.
- No rate limiting on `/api/login` — a real app would throttle repeated
  failed attempts to slow down brute-forcing.
- CORS is wide open (`cors()` with no options) — fine for local dev, but a
  deployed app should restrict it to the actual frontend's origin.

## 7. Extending it

- Add a "Remember me" checkbox that changes token expiry
- Add a signup form using the same validation utility
- Swap the mock array for a real database (e.g. MongoDB/Postgres) — only
  `data/users.js` and the lookup in `server.js` would need to change, the
  frontend wouldn't need to know
