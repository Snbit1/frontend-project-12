import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from '../api/axios'
import { loginSuccess } from '../store/slices/authSlice'
import {
  Container,
  Row,
  Col,
  Button,
  Form as BootstrapForm,
  Alert,
  Card,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { loginSchema } from '../validation/schemas'

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState(null)

  const validationSchema = loginSchema(t)

  const handleLogin = async (values, { setSubmitting }) => {
    setError(null)
    try {
      const response = await api.post('/login', values)
      dispatch(
        loginSuccess({
          token: response.data.token,
          user: { username: values.username },
        }),
      )
      navigate('/')
    }
    catch (err) {
      if (err.response && err.response.status === 401) {
        setError(t('incorrectUser'))
      }
      else {
        setError(t('networkError'))
      }
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="mb-4 text-center">{t('entrance')}</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <BootstrapForm.Group className="form-floating mb-3">
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        as={BootstrapForm.Control}
                        placeholder={t('username2')}
                      />
                      <BootstrapForm.Label htmlFor="username">
                        {t('username2')}
                      </BootstrapForm.Label>
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="form-floating mb-3">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        as={BootstrapForm.Control}
                        placeholder={t('enterPassword')}
                      />
                      <BootstrapForm.Label htmlFor="password">
                        {t('password')}
                      </BootstrapForm.Label>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </BootstrapForm.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-100"
                    >
                      {t('entrance')}
                    </Button>

                    <div className="mt-3 text-center">
                      <span>{t('haveNoAcc')}</span>
                      <Link to="/signup">{t('createAcc')}</Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage
