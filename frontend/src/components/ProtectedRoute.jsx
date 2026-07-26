import { Navigate } from 'react-router-dom'

// Gate for the Dashboard: no token in localStorage means no completed
// login, so bounce straight back to /login instead of rendering the page.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('gk_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
