import { io } from 'socket.io-client';

let socketInstance = null;

export function connectSocket() {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
      transports: ['websocket']
    });
  }

  return socketInstance;
}

export function getSocket() {
  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
