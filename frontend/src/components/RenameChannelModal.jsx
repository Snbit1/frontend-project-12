import React, { useEffect, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const RenameChannelModal = ({
  show,
  handleClose,
  channels,
  channel,
  onRename,
}) => {
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
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
      .notOneOf(
        channels.map((c) => c.name).filter((n) => n !== channel.name),
        'Такой канал уже существует'
      )
      .required('Обязательное поле'),
  })

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать</Modal.Title>
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
                placeholder="Новое имя канала"
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
                Отмена
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Переименовать
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
