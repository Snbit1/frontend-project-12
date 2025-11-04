import { useEffect, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import { toast } from 'react-toastify'
import { cleanText } from '../utils/profanity'
import { channelNameSchema } from '../validation/schemas'

const RenameChannelModal = ({
  show,
  handleClose,
  channels,
  channel,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef(null)

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 0)
    }
  }, [show, channel])

  if (!channel) return null
  const validationSchema = channelNameSchema(t, channels.map(c => c.name), channel?.name)

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const cleanedName = cleanText(values.name)
      await api.patch(`/channels/${channel.id}`, { name: cleanedName })
      toast.success(t('toast.channelRenamed'))
      handleClose()
    }
    catch (err) {
      console.error('Ошибка переименования канала', err)
      toast.error(t('toast.errorRenameChannel'))
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <Field
                name="name"
                innerRef={inputRef}
                className="form-control"
                placeholder={t('newChannelName')}
                aria-label="Имя канала"
              />
              <label className="visually-hidden">Имя канала</label>
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t('cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {t('send')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
