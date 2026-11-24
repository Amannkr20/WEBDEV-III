import { io } from 'socket.io-client';

// Connect to backend server on port 5000 (since frontend runs on 8080)
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
});
