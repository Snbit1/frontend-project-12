import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannels } from '../slices/channelsSlice'
import { addMessageLocal, fetchMessages } from '../slices/messagesSlice'
import {
  addChannelLocal,
  removeChannelLocal,
  renameChannelLocal,
} from '../slices/channelsSlice'
import RenameChannelModal from '../components/RenameChannelModal'
import {
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap'
import AddChannelModal from '../components/AddChannelModal'
import ConfirmDeleteChannelModal from '../components/ConfirmDeleteChannelModal'
import socket from '../socket'
import api from '../api/axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { cleanText } from '../utils/profanity'

const ChatPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const channels = useSelector((s) => s.channels.items)
  const messages = useSelector((s) => s.messages.items)
  const channelsStatus = useSelector((s) => s.channels.status)
  const messagesStatus = useSelector((s) => s.messages.status)
  const username = useSelector((s) => s.auth.user?.username || 'Гость')
  const messagesError = useSelector((s) => s.messages.error)

  const [newMessage, setNewMessage] = useState('')
  const [selectedChannelId, setSelectedChannelId] = useState(null)
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [showAddChannelModal, setShowAddChannelModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [channelToRename, setChannelToRename] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [channelToDelete, setChannelToDelete] = useState(null)

  const handleOpenAddChannel = () => setShowAddChannelModal(true)
  const handleCloseAddChannel = () => setShowAddChannelModal(false)

  const handleAddChannel = async (name) => {
    try {
      const cleanedName = cleanText(name)
      await api.post('/channels', { name: cleanedName })
      toast.success(t('toast.channelAdded'))
      handleCloseAddChannel()
    } catch (err) {
      console.error('Ошибка добавления канала', err)
      toast.error(t('toast.errorAddChannel'))
    }
  }

  const handleCloseRenameChannel = () => {
    setShowRenameModal(false)
    setChannelToRename(null)
  }

  const handleRenameChannel = async (id, newName) => {
    try {
      const cleanedName = cleanText(newName)
      await api.patch(`/channels/${id}`, { name: cleanedName })
      toast.success(t('toast.channelRenamed'))
      handleCloseRenameChannel()
    } catch (err) {
      console.error('Ошибка переименования канала', err)
      toast.error(t('toast.errorRenameChannel'))
    }
  }

  const handleOpenRenameChannel = (channel) => {
    setChannelToRename(channel)
    setShowRenameModal(true)
  }

  const handleDeleteChannel = async (id) => {
    try {
      await api.delete(`/channels/${id}`)
      dispatch(removeChannelLocal(id))
      if (selectedChannelId === id && channels.length > 0) {
        setSelectedChannelId(channels[0].id)
      }
      toast.success(t('toast.channelDeleted'))
    } catch (err) {
      console.error('Ошибка удаления канала', err)
    }
  }

  const handleOpenDeleteChannel = (channel) => {
    setChannelToDelete(channel)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteChannel = () => {
    setChannelToDelete(null)
    setShowDeleteModal(false)
  }

  const handleConfirmDeleteChannel = async () => {
    if (!channelToDelete) return
    await handleDeleteChannel(channelToDelete.id)
    handleCloseDeleteChannel()
  }

  const formatMessagesCount = (count) => {
    if (count === 0) {
      return t('noMessages')
    }
    if (count % 100 >= 11 && count % 100 <= 14) {
      return t('manyMessages', { count })
    }
    switch (count % 10) {
      case 1:
        return t('oneMessage')
      case 2:
      case 3:
      case 4:
        return t('fewMessages', { count })
      default:
        return t('manyMessages', { count })
    }
  }

  useEffect(() => {
    if (channelsStatus === 'failed') {
      toast.error(t('toast.errorLoadChannels'))
    }
  }, [channelsStatus, t])

  useEffect(() => {
    if (messagesStatus === 'failed' && messagesError && selectedChannelId) {
      toast.error(t('toast.errorLoadMessages'))
    }
  }, [messagesStatus, messagesError, selectedChannelId, t])

  useEffect(() => {
    const handleNewMessage = (message) => {
      dispatch(addMessageLocal(message))
    }
    socket.on('newMessage', handleNewMessage)
    return () => {
      socket.off('newMessage', handleNewMessage)
    }
  }, [dispatch])

  useEffect(() => {
    const handleConnect = () => {
      console.log('Подключено к серверу WebSocket')
      setIsConnected(true)
      toast.info(t('toast.online'))
    }
    const handleDisconnect = () => {
      console.log('Отключено от сервера')
      setIsConnected(false)
      toast.warn(t('toast.offline'))
    }
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [t])

  useEffect(() => {
    const localChannels = JSON.parse(localStorage.getItem('channels')) || []
    if (localChannels.length === 0) {
      dispatch(fetchChannels())
    }
  }, [dispatch])

  useEffect(() => {
    if (channelsStatus === 'succeeded' && channels.length > 0) {
      const generalChannel = channels.find((c) => c.name === 'general')
      setSelectedChannelId(generalChannel?.id ?? channels[0].id)
    }
  }, [channels, channelsStatus])

  useEffect(() => {
    if (channelsStatus === 'succeeded' && selectedChannelId) {
      dispatch(fetchMessages(selectedChannelId))
    }
  }, [dispatch, channels, selectedChannelId])

  useEffect(() => {
    const handleNewChannel = (channel) => {
      console.log('Получен новый канал от сервера:', channel)
      dispatch(addChannelLocal({ ...channel, removable: true }))
      setSelectedChannelId(channel.id)
    }
    socket.on('newChannel', handleNewChannel)
    return () => {
      socket.off('newChannel', handleNewChannel)
    }
  }, [dispatch])

  useEffect(() => {
    const handleRenameChannelSocket = (channel) => {
      dispatch(renameChannelLocal(channel))
    }

    const handleDeleteChannelSocket = ({ id }) => {
      dispatch(removeChannelLocal(id))
      if (selectedChannelId === id && channels.length > 0) {
        setSelectedChannelId(channels[0].id)
      }
    }

    socket.on('renameChannel', handleRenameChannelSocket)
    socket.on('deleteChannel', handleDeleteChannelSocket)

    return () => {
      socket.off('renameChannel', handleRenameChannelSocket)
      socket.off('deleteChannel', handleDeleteChannelSocket)
    }
  }, [dispatch, selectedChannelId, channels])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChannelId) return

    try {
      const cleanedMessage = cleanText(newMessage)
      await api.post('/messages', {
        body: cleanedMessage,
        channelId: selectedChannelId,
        username,
      })
      setNewMessage('')
    } catch (err) {
      console.error('Ошибка отправки сообщения', err)
    }
  }

  const filteredMessages = messages.filter(
    (m) => m.channelId === selectedChannelId
  )
  const selectedChannel = channels.find((c) => c.id === selectedChannelId)

  if (channelsStatus === 'loading' || messagesStatus === 'loading') {
    return <p>Загрузка...</p>
  }

  return (
    <Row>
      <Col md={3}>
        <div className="d-flex justify-content-between align-items-center">
          <h5>{t('channels')}</h5>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleOpenAddChannel}
          >
            +
          </Button>
        </div>
        <ListGroup as="ul" style={{ marginTop: '0.5rem' }}>
          {channels.map((c, index) => {
            const isRemovable = c.removable

            return (
              <ListGroup.Item
                as="li"
                key={c.id ?? `channel-${index}`}
                active={c.id === selectedChannelId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '0 1rem',
                  height: '2.5rem',
                  boxSizing: 'border-box',
                }}
                onClick={() => setSelectedChannelId(c.id)}
              >
                <Button
                  role="button"
                  variant={c.id === selectedChannelId ? 'primary' : 'light'}
                  size="sm"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    margin: 0,
                    outline: 'none',
                    boxShadow: 'none',
                    width: '100%',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                  }}
                  className="p-0 m-0 border-0"
                >
                  <span style={{ marginRight: '5px' }}>#</span>
                  {c.name}
                </Button>
                {isRemovable && (
                  <Dropdown
                    as={ButtonGroup}
                    onClick={(e) => e.stopPropagation()}
                    align="end"
                  >
                    <Dropdown.Toggle
                      split
                      as="button"
                      variant="outline-primary"
                      id={`dropdown-${c.id}`}
                      style={{
                        background: 'transparent',
                        padding: '0 0.25rem',
                        height: '1.75rem',
                        minHeight: '0',
                        color: 'black',
                        border: 'none',
                      }}
                    />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as="button"
                        onClick={() => handleOpenDeleteChannel(c)}
                      >
                        {t('delete')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="button"
                        onClick={() => handleOpenRenameChannel(c)}
                      >
                        {t('rename')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </Col>

      <Col md={9}>
        <div className="d-flex flex-column mb-2">
          <div className="fw-bold"># {selectedChannel?.name}</div>
          <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
            {formatMessagesCount(filteredMessages.length)}
          </div>
          <div
            style={{ fontSize: '0.8em', color: isConnected ? 'green' : 'red' }}
          >
            {isConnected ? t('online') : t('offline')}
          </div>
        </div>
        <div
          style={{
            height: '400px',
            overflowY: 'scroll',
            border: '1px solid #ddd',
            padding: '8px',
            marginBottom: '12px',
          }}
        >
          {filteredMessages.map((m, index) => (
            <div key={m.id ?? `msg-${index}`}>
              <strong>{m.username}: </strong>
              <span>{m.body}</span>
            </div>
          ))}
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder={t('placeholderMessage')}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {t('send')}
          </Button>
        </Form>
      </Col>
      <AddChannelModal
        show={showAddChannelModal}
        handleClose={handleCloseAddChannel}
        channels={channels}
        onAdd={handleAddChannel}
      />
      <RenameChannelModal
        show={showRenameModal}
        handleClose={handleCloseRenameChannel}
        channels={channels}
        channel={channelToRename}
        onRename={handleRenameChannel}
      />
      <ConfirmDeleteChannelModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteChannel}
        onConfirm={handleConfirmDeleteChannel}
      />
    </Row>
  )
}

export default ChatPage
