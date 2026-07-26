import express from 'express'
import cors from 'cors'
import { users } from './data/users.js'

const app = express()
app.use(cors())
app.use(express.json())

// Simple request logger — helpful while developing/demoing.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {}

  // Server-side validation — the frontend already checks this, but a
  // backend must never trust the client, so the same checks are repeated
  // here independently.
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const user = users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  )

  // Deliberately vague on purpose: "invalid email or password" rather than
  // "no account with that email" — doesn't reveal which part was wrong,
  // which is standard practice so attackers can't enumerate valid emails.
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  // Mock token — NOT a real JWT, just enough to simulate an authenticated
  // session for this demo. A production app would sign a real JWT or use
  // server-side sessions instead.
  const token = Buffer.from(`${user.email}:${Date.now()}`).toString('base64')

  return res.status(200).json({
    message: 'Login successful.',
    token,
    user: { name: user.name, email: user.email },
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Gk backend running on http://localhost:${PORT}`)
})
