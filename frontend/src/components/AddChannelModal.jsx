import { useEffect, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'

const AddChannelModal = ({ show, handleClose, channels, onAdd }) => {
  const inputRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus()
    }
  }, [show])

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('usernameMin'))
      .max(20, t('usernameMax'))
      .notOneOf(
        channels.map(c => c.name),
        t('channelExists'),
      )
      .required(t('requiredField')),
  })

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('addChannelModal')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await onAdd(values.name)
          setSubmitting(false)
          handleClose()
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <label className="visually-hidden">Имя канала</label>
              <Field
                name="name"
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
