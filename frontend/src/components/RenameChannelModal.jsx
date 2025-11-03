/* eslint-disable prettier/prettier */
import { useEffect, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'

const RenameChannelModal = ({
  show,
  handleClose,
  channels,
  channel,
  onRename,
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
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('usernameMin'))
      .max(20, t('usernameMax'))
      .notOneOf(
        channels.map(c => c.name).filter(n => n !== channel.name),
        t('channelExists'),
      )
      .required(t('requiredField')),
  })

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await onRename(channel.id, values.name)
          setSubmitting(false)
          handleClose()
        }}
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
