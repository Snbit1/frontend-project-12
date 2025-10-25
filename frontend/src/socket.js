import { io } from 'socket.io-client'

const socket = io('/', {
  path: '/socket.io',
  transports: ['websocket'],
})

socket.on('connect_error', (err) => {
  console.error('Ошибка подключения к сокету:', err)
})

export default socket
