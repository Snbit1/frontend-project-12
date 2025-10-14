import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import RequireAuth from './components/RequireAuth'
import { logout } from './slices/authSlice'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'

const App = () => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Hexlet Chat
          </Navbar.Brand>
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Войти
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Регистрация
                </Nav.Link>
              </>
            ) : (
              <Button variant="outline-secondary" onClick={handleLogout}>
                Выйти
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<ChatPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
