import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import { useDispatch } from 'react-redux'
import { removeChannelLocal } from '../store/slices/channelsSlice'
import { toast } from 'react-toastify'

const ConfirmDeleteChannelModal = ({
  show,
  handleClose,
  channel,
  channels,
  selectedChannelId,
  setSelectedChannelId,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleConfirm = async () => {
    if (!channel) return
    try {
      await api.delete(`/channels/${channel.id}`)
      dispatch(removeChannelLocal(channel.id))
      if (selectedChannelId === channel.id && channels.length > 1) {
        const remainingChannels = channels.filter(c => c.id !== channel.id)
        const newSelected = remainingChannels.find(c => c.name === 'general') || remainingChannels[0]
        setSelectedChannelId(newSelected.id)
      }

      toast.success(t('toast.channelDeleted'))
      handleClose()
    }
    catch (err) {
      console.error('Ошибка удаления канала', err)
      toast.error(t('toast.errorDeleteChannel'))
    }
  }

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
        <Button variant="danger" onClick={handleConfirm}>
          {t('delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDeleteChannelModal
