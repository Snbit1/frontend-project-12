import React from 'react'
import { Formik, Form, Field } from 'formik'

const LoginPage = () => {
  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Вход</h2>

      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values, { setSubmitting }) => {
          console.log('Форма отправлена:', values)
          setSubmitting(false)
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
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage
