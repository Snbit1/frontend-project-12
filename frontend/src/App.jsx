import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  return (
    <div>
      <nav style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ marginRight: '12px' }}>
          Home
        </Link>
        <Link to="/login">Login</Link>
      </nav>

      <main style={{ padding: '16px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
