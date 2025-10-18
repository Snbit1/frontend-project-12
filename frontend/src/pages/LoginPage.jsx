import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from '../api/axios'
import { loginSuccess } from '../slices/authSlice'
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

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState(null)

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('usernameMin'))
      .max(20, t('usernameMax'))
      .required(t('requiredField')),
    password: Yup.string()
      .min(6, t('passwordMin'))
      .required(t('requiredField')),
  })

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
                onSubmit={async (values, { setSubmitting }) => {
                  setError(null)
                  try {
                    const response = await api.post('/login', values)
                    dispatch(
                      loginSuccess({
                        token: response.data.token,
                        user: { username: values.username },
                      })
                    )
                    navigate('/')
                  } catch (err) {
                    if (err.response && err.response.status === 401) {
                      setError(t('incorrectUser'))
                    } else {
                      setError(t('networkError'))
                    }
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>{t('username')}</BootstrapForm.Label>
                      <Field
                        name="username"
                        type="text"
                        as={BootstrapForm.Control}
                        placeholder={t('enterUsername')}
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>{t('password')}</BootstrapForm.Label>
                      <Field
                        name="password"
                        type="password"
                        as={BootstrapForm.Control}
                        placeholder={t('enterPassword')}
                      />
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
