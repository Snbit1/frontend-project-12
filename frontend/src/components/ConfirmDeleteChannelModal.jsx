import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ConfirmDeleteChannelModal = ({
  show,
  handleClose,
  onConfirm,
  channel,
}) => {
  const { t } = useTranslation()

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('deleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('confirmDeleteChannel', { name: channel?.name })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('cancel')}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {t('delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDeleteChannelModal
