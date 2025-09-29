import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div>
    <h2>404 - страница не найдена</h2>
    <Link to="/">Вернуться на главную</Link>
  </div>
)

export default NotFoundPage
