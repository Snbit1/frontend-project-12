import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RequireAuth from './components/RequireAuth'
import { logout } from './slices/authSlice'

const App = () => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }
  return (
    <div>
      <nav style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ marginRight: '12px' }}>
          Home
        </Link>
        {!isAuthenticated ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={handleLogout} style={{ marginLeft: 8 }}>
            Выйти
          </button>
        )}
      </nav>

      <main style={{ padding: '16px' }}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
