import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const RequireAuth = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const location = useLocation()

  const publicPaths = ['/login', '/signup']

  if (!isAuthenticated && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RequireAuth
