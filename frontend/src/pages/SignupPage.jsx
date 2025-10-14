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

const SignupPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState(null)

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'Минимум 6 символов')
      .required('Обязательное поле'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Обязательное поле'),
  })

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="mb-4 text-center">Регистрация</h2>

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
                      })
                    )
                    navigate('/')
                  } catch (err) {
                    if (err.response && err.response.status === 409) {
                      setError('Пользователь с таким именем уже существует')
                    } else {
                      setError('Ошибка сети или сервера. Попробуйте позже.')
                    }
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>
                        Имя пользователя
                      </BootstrapForm.Label>
                      <Field
                        name="username"
                        type="text"
                        as={BootstrapForm.Control}
                        placeholder="Введите имя пользователя"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Пароль</BootstrapForm.Label>
                      <Field
                        name="password"
                        type="password"
                        as={BootstrapForm.Control}
                        placeholder="Введите пароль"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>
                        Подтвердите пароль
                      </BootstrapForm.Label>
                      <Field
                        name="confirmPassword"
                        type="password"
                        as={BootstrapForm.Control}
                        placeholder="Повторите пароль"
                      />
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
                      Зарегистрироваться
                    </Button>

                    <div className="mt-3 text-center">
                      <Link to="/login">Уже есть аккаунт? Войти</Link>
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

export default SignupPage
