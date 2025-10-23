import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import UserService from './services/user.service.js';

const userSocketMap = new Map();

let io;

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      return next();
    } catch (error) {
      return next(new Error('Authentication failed: Invalid token.'));
    }
  }
  return next(new Error('Authentication failed: No token provided.'));
};

export const initSocket = (server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Allow all origins for now
      methods: ['GET', 'POST'],
    },
  });

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const userId = socket.userId;
    if (userId) {
      console.log(`Socket connected: ${socket.id} for user ${userId}`);
      userSocketMap.set(userId, socket.id);
    }

    socket.on('updateLocation', async (data) => {
      const userId = socket.userId;
      if (!userId || !data.lat || !data.lng) {
        // Here you could emit an error back to the client
        return;
      }

      try {
        await UserService.updateUserLocation(userId, data.lat, data.lng);
      } catch (error) {
        console.error('Error in updateLocation:', error);
        // Here you could emit an error back to the client
      }
    });

    socket.on('disconnect', () => {
      const userId = socket.userId;
      if (userId) {
        console.log(`Socket disconnected: ${socket.id}`);
        userSocketMap.delete(userId);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const emitToUser = (userId, event, data) => {
  const socketId = userSocketMap.get(userId.toString());
  if (socketId) {
    getIO().to(socketId).emit(event, data);
    return true;
  } else {
    return false;
  }
};
