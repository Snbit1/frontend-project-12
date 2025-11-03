import { useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import RequireAuth from './components/RequireAuth'
import { logout } from './slices/authSlice'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { clearMessages } from './slices/messagesSlice'

const App = () => {
  const { t } = useTranslation()
  const isAuthenticated = useSelector(s => s.auth.isAuthenticated)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(clearMessages())
      dispatch({ type: 'channels/clearUserChannels' })
      console.log('Сообщения и пользовательские каналы очищены')
    }, 600000)

    return () => clearInterval(interval)
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            {t('hexlet')}
          </Navbar.Brand>
          <Nav className="ms-auto">
            {!isAuthenticated
              ? (
                <>
                  <Nav.Link as={Link} to="/login">
                    {t('entrance')}
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup">
                    {t('registration')}
                  </Nav.Link>
                </>
              )
              : (
                <Button variant="outline-secondary" onClick={handleLogout}>
                  {t('logOut')}
                </Button>
              )
            }
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route
            path="/"
            element={(
              <RequireAuth>
                <ChatPage />
              </RequireAuth>
            )}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
