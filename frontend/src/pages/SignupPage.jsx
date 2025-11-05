import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useNavigate } from 'react-router-dom'
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
import { fetchChannels } from '../store/slices/channelsSlice'
import { signupSchema } from '../validation/schemas'

const SignupPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState(null)

  const validationSchema = signupSchema(t)

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="mb-4 text-center">{t('registration')}</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setError(null)
                  try {
                    const { username, password } = values
                    const response = await api.post('/signup', {
                      username,
                      password,
                    })
                    dispatch(
                      loginSuccess({
                        token: response.data.token,
                        user: { username: values.username },
                      }),
                    )
                    await dispatch(fetchChannels()).unwrap()
                    navigate('/')
                  }
                  catch (err) {
                    if (err.response && err.response.status === 409) {
                      setError(t('userExists'))
                    }
                    else {
                      setError(t('networkError'))
                    }
                  }
                  finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <BootstrapForm.Group className="form-floating mb-3">
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="off"
                        as={BootstrapForm.Control}
                        placeholder={t('username')}
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-danger small mt-1"
                      />
                      <BootstrapForm.Label htmlFor="username">
                        {t('username')}
                      </BootstrapForm.Label>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="form-floating mb-3">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="off"
                        as={BootstrapForm.Control}
                        placeholder={t('password')}
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

                    <BootstrapForm.Group className="form-floating mb-3">
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="off"
                        as={BootstrapForm.Control}
                        placeholder={t('confirmPassword')}
                      />
                      <BootstrapForm.Label htmlFor="confirmPassword">
                        {t('confirmPassword')}
                      </BootstrapForm.Label>
                      <ErrorMessage
                        name="confirmPassword"
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
                      {t('register')}
                    </Button>
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

export default SignupPage
