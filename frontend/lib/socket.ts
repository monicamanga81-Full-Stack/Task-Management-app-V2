import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function createSocket(): Socket {
  if (socket) return socket;
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  // assume the backend serves a socket.io server at same origin
  socket = io(backend, { transports: ['websocket', 'polling'] });
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
