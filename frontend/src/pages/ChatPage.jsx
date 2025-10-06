import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannels } from '../slices/channelsSlice'
import { addMessageLocal, fetchMessages } from '../slices/messagesSlice'
import { Row, Col, ListGroup, Form, Button } from 'react-bootstrap'
import socket from '../socket'

const ChatPage = () => {
  const dispatch = useDispatch()
  const channels = useSelector((s) => s.channels.items)
  const messages = useSelector((s) => s.messages.items)
  const channelsStatus = useSelector((s) => s.channels.status)
  const messagesStatus = useSelector((s) => s.messages.status)
  const username = useSelector((s) => s.auth.user?.username || 'Гость')

  const [newMessage, setNewMessage] = useState('')
  const [selectedChannelId, setSelectedChannelId] = useState(null)
  const [isConnected, setIsConnected] = useState(socket.connected)

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
    }
    const handleDisconnect = () => {
      console.log('Отключено от сервера')
      setIsConnected(false)
    }
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [])

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  useEffect(() => {
    if (channels.length > 0 && selectedChannelId === null) {
      setSelectedChannelId(channels[0].id)
    }
  }, [channels, selectedChannelId])

  if (channelsStatus === 'loading' || messagesStatus === 'loading') {
    return <p>Загрузка...</p>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    if (!selectedChannelId) return

    const messagePayload = {
      body: newMessage,
      channelId: selectedChannelId,
      username,
    }
    socket.emit('newMessage', messagePayload, (response) => {
      if (response.status === 'ok') {
        setNewMessage('')
      } else {
        console.error('Ошибка отправки:', response.error)
      }
    })
  }

  const filteredMessages = messages.filter(
    (m) => m.channelId === selectedChannelId
  )

  return (
    <Row>
      <Col md={3}>
        <h5>Каналы</h5>
        <ListGroup>
          {channels.map((c, index) => (
            <ListGroup.Item
              key={c.id ?? `channel-${index}`}
              active={c.id === selectedChannelId}
              onClick={() => setSelectedChannelId(c.id)}
              style={{ cursor: 'pointer' }}
            >
              {c.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>

      <Col md={9}>
        <h5>
          Сообщения{' '}
          <span
            style={{
              fontSize: '0.8em',
              color: isConnected ? 'green' : 'red',
            }}
          >
            {isConnected ? 'Онлайн' : 'Оффлайн'}
          </span>
        </h5>
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
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Отправить
          </Button>
        </Form>
      </Col>
    </Row>
  )
}

export default ChatPage
