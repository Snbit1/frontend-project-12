import { io } from 'socket.io-client'

const token = localStorage.getItem('token')

const socket = io('/socket.io', {
  auth: { token },
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

socket.on('connect', () => console.log('Подключено к серверу Hexlet WebSocket'))
socket.on('disconnect', (reason) => console.log('Отключено от сервера:', reason))
socket.on('connect_error', (err) => console.error('Ошибка подключения к сокету:', err.message))

export default socket
