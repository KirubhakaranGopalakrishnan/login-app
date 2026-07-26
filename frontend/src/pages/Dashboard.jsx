import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('gk_user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('gk_token')
    localStorage.removeItem('gk_user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="flex items-center justify-between border-b border-stone-800 px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full border-2 border-teal-300" aria-hidden="true" />
          <span className="font-display text-xl tracking-tight">GK</span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-300
                     transition hover:border-teal-400/60 hover:text-teal-300"
        >
          Log out
        </button>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-stone-400">
          {user?.email ? `Signed in as ${user.email}` : 'You are signed in.'}
        </p>

        {/* Placeholder content — this is a dummy dashboard just to prove
            the redirect worked, not a real product surface. */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card label="Open tasks" value="12" />
          <Card label="This week" value="4h 20m focused" />
          <Card label="Streak" value="6 days" />
        </div>

        <div className="mt-6 rounded-xl border border-stone-800 bg-stone-900/60 p-6">
          <p className="text-sm text-stone-400">
            This is a placeholder dashboard. In a real app, this is where
            your actual product content would live.
          </p>
        </div>
      </main>
    </div>
  )
}

function Card({ label, value }) {
  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1.5 text-lg font-medium text-stone-100">{value}</p>
    </div>
  )
}

export default Dashboard
