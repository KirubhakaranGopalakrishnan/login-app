import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { validateLoginForm } from '../utils/validation.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear that field's error as soon as the user starts fixing it,
    // rather than making them re-submit to see it disappear.
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const errors = validateLoginForm(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    try {
      const { data } = await axios.post(`${API_URL}/api/login`, form)
      localStorage.setItem('gk_token', data.token)
      localStorage.setItem('gk_user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      if (err.response) {
        // Backend responded with a real error (400/401) — show its message.
        setServerError(err.response.data?.message || 'Login failed. Please try again.')
      } else {
        // No response at all — the backend probably isn't running.
        setServerError('Could not reach the server. Is the backend running on port 5000?')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-stone-950 text-stone-100">
      {/* Brand panel — hidden on small screens so the form gets full focus
          on mobile; reappears as a side panel from the lg breakpoint up. */}
      <aside className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-teal-900 via-stone-900 to-stone-950 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(45,212,191,0.5), transparent 40%), radial-gradient(circle at 80% 70%, rgba(45,212,191,0.3), transparent 45%)',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full border-2 border-teal-300" aria-hidden="true" />
            <span className="font-display text-2xl tracking-tight">GK</span>
          </div>
        </div>

        <div className="relative max-w-sm">
          <p className="font-display text-3xl italic leading-snug text-stone-100">
            "Fewer tabs. Fewer pings. Just the work that matters."
          </p>
          <p className="mt-4 text-sm text-teal-200/70">
            GK is a calmer home for your team's daily work — no clutter,
            no noise, just what's in front of you.
          </p>
        </div>

        <p className="relative text-xs text-stone-500">
          © {new Date().getFullYear()} GK. Not a real product — demo project.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <span className="h-7 w-7 rounded-full border-2 border-teal-300" aria-hidden="true" />
            <span className="font-display text-xl tracking-tight">GK</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-stone-400">
            Sign in to pick up right where you left off.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`mt-1.5 w-full rounded-lg bg-stone-900 border px-3.5 py-2.5 text-sm
                           placeholder:text-stone-600 focus:outline-none focus:ring-2
                           ${fieldErrors.email
                             ? 'border-red-500/60 focus:ring-red-500/40'
                             : 'border-stone-700 focus:ring-teal-400/60'}`}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-stone-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs text-teal-400 hover:text-teal-300"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`mt-1.5 w-full rounded-lg bg-stone-900 border px-3.5 py-2.5 text-sm
                           placeholder:text-stone-600 focus:outline-none focus:ring-2
                           ${fieldErrors.password
                             ? 'border-red-500/60 focus:ring-red-500/40'
                             : 'border-stone-700 focus:ring-teal-400/60'}`}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              {fieldErrors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-red-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {serverError && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-teal-400 py-2.5 text-sm font-medium text-stone-950
                         transition hover:bg-teal-300 active:scale-[0.99]
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-stone-800 bg-stone-900/60 p-3.5 text-xs text-stone-400">
            <p className="font-medium text-stone-300">Demo credentials</p>
            <p className="mt-1">Kirubha@gk.app / Gk@123</p>
            <p>dev@gk.app / Gk@123</p>
            
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
