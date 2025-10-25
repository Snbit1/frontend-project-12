import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.CI
  ? import.meta.env.VITE_SOCKET_URL_DOCKER
  : '/'

const socket = io(SOCKET_URL, {
  path: '/socket.io',
  transports: ['websocket'],
})

socket.on('connect', () => {
  console.log('Сокет подключен')
})

socket.on('connect_error', (err) => {
  console.error('Ошибка подключения к сокету:', err)
})

export default socket
