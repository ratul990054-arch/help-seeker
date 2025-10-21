import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import AppointmentService from "./services/appointment.service.js";
import NotificationService from "./services/notification.service.js";
import AppError from "./utils/appError.js";

// userId -> socketId ম্যাপ সংরক্ষণ করার জন্য
const userSocketMap = new Map();

let io;

// ✅ Socket Authentication Middleware
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.headers.token;
  console.log("Authenticating socket with token:", token);

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || "defaultsecret"
      );
      if (decoded._id) {
        socket.userId = decoded._id.toString();
        return next();
      } else {
        return next(new Error("Authentication failed: Invalid token."));
      }
    } catch (error) {
      return next(new Error("Authentication failed: Invalid token."));
    }
  }

  // 10 সেকেন্ডে authenticate না হলে disconnect করে দিবে
  setTimeout(() => {
    if (!socket.userId) {
      console.log(`Socket ${socket.id} did not authenticate in time.`);
      socket.disconnect();
    }
  }, 10000);

  next();
};

// ✅ Initialize Socket.io Server
export const initSocket = (server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.userId;
    if (userId) {
      console.log(`Socket connected: ${socket.id} for user ${userId}`);
      userSocketMap.set(userId, socket.id);
    }

    //📍 User location event
    socket.on("sendLocation", async (data) => {
      const userId = socket.userId;
      console.log(`Received location from user ${userId}:`, data);
      if (!userId) return;

      try {
        await AppointmentService.getAppointmentDetails(
          data.appointmentId,
          userId
        );
        await AppointmentService.automaticCheckIn(
          data.appointmentId,
          userId,
          data.lat,
          data.lng
        );
      } catch (error) {
        if (error instanceof AppError && error.statusCode === 404) {
          socket.emit("error", {
            message: "Not authorized: This is not your appointment",
          });
        } else {
          console.error("Error in sendLocation:", error);
        }
      }
    });



    // 🔌 Disconnect handler
    socket.on("disconnect", () => {
      const userId = socket.userId;
      if (userId) {
        console.log(`Socket disconnected: ${socket.id}`);
        userSocketMap.delete(userId);
      }
    });
  });

  return io;
};

// ✅ Get io instance
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// ✅ Emit to specific user
export const emitToUser = (userId, event, data) => {
  const socketId = userSocketMap.get(userId.toString());
  if (socketId) {
    getIO().to(socketId).emit(event, data);
    console.log(`Emitted '${event}' to user ${userId} on socket ${socketId}`);
    return true;
  } else {
    console.log(
      `Could not find socket for user ${userId} to emit event '${event}'`
    );
    return false;
  }
};
