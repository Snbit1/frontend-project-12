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
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

