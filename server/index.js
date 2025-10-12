import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('newMessage', (message, callback) => {
    io.emit('newMessage', message)
    callback({ status: 'ok' })
  })
  socket.on('newChannel', (channel, callback) => {
    console.log('Получен новый канал от клиента:', channel)
    const newChannel = { id: Date.now(), removable: true, ...channel }
    io.emit('newChannel', newChannel)
    if (callback) callback({ status: 'ok' })
  })
  socket.on('renameChannel', (channel, callback) => {
    io.emit('renameChannel', channel)
    if (callback) callback({ status: 'ok' })
  })

  socket.on('deleteChannel', ({ id }, callback) => {
    io.emit('deleteChannel', { id })
    if (callback) callback({ status: 'ok' })
  })
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

