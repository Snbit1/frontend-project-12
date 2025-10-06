import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL || '/')
socket.on('connect_error', (err) => {
  console.error('Ошибка подключения к сокету:', err)
})

export default socket
