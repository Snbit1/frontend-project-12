import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannels } from '../slices/channelsSlice'
import { fetchMessages } from '../slices/messagesSlice'
import { Row, Col, ListGroup, Form, Button } from 'react-bootstrap'

const ChatPage = () => {
  const dispatch = useDispatch()
  const channels = useSelector((s) => s.channels.items)
  const messages = useSelector((s) => s.messages.items)
  const channelsStatus = useSelector((s) => s.channels.status)
  const messagesStatus = useSelector((s) => s.messages.status)

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  if (channelsStatus === 'loading' || messagesStatus === 'loading') {
    return <p>Загрузка...</p>
  }

  return (
    <Row>
      <Col md={3}>
        <h5>Каналы</h5>
        <ListGroup>
          {channels.map((c) => (
            <ListGroup.Item key={c.id}>{c.name}</ListGroup.Item>
          ))}
        </ListGroup>
      </Col>

      <Col md={9}>
        <h5>Сообщения</h5>
        <div
          style={{
            height: '400px',
            overflowY: 'scroll',
            border: '1px solid #ddd',
            padding: '8px',
            marginBottom: '12px',
          }}
        >
          {messages.map((m) => (
            <div key={m.id}>
              <strong>{m.username}: </strong>
              <span>{m.body}</span>
            </div>
          ))}
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Control type="text" placeholder="Введите сообщение..." />
          </Form.Group>
          <Button variant="primary">Отправить</Button>
        </Form>
      </Col>
    </Row>
  )
}

export default ChatPage
