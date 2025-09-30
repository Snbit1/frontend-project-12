import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from '../api/axios'
import { loginSuccess } from '../slices/authSlice'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState(null)
  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Вход</h2>

      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null)
          try {
            const response = await api.post('/login', values)
            const { token, user } = response.data
            if (!token) {
              throw new Error('Токен не получен')
            }
            dispatch(loginSuccess({ token, user }))
            navigate('/')
          } catch (err) {
            if (err.response && err.response.status === 401) {
              setError('Неверное имя пользователя или пароль')
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
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="username">Имя пользователя</label>
              <Field
                id="username"
                name="username"
                type="text"
                placeholder="Введите имя"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: 8,
                  marginTop: 6,
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label htmlFor="password">Пароль</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Введите пароль"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: 8,
                  marginTop: 6,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 12px',
              }}
            >
              Войти
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage
