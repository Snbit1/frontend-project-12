import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <div>
      <h2>{t('notFound')}</h2>
      <Link to="/">{t('returnToHome')}</Link>
    </div>
  )
}

export default NotFoundPage
