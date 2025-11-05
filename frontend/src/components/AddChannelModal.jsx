import { useEffect, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import { toast } from 'react-toastify'
import { cleanText } from '../utils/profanity'
import { channelNameSchema } from '../validation/schemas'

const AddChannelModal = ({ show, handleClose, channels, setSelectedChannelId }) => {
  const inputRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus()
    }
  }, [show])

  const validationSchema = channelNameSchema(t, channels.map(c => c.name))

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const cleanedName = cleanText(values.name)
      const response = await api.post('/channels', { name: cleanedName })
      const newChannel = response.data
      setSelectedChannelId(newChannel.id)
      toast.success(t('toast.channelAdded'))
      handleClose()
    }
    catch (err) {
      console.error('Ошибка добавления канала', err)
      toast.error(t('toast.errorAddChannel'))
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('addChannelModal')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <label className="visually-hidden">Имя канала</label>
              <Field
                name="name"
                autoComplete="off"
                innerRef={inputRef}
                className="form-control"
                aria-label="Имя канала"
              />
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

export default AddChannelModal
