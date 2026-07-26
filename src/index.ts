import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  updateText,
  addImage,
  deleteImage,
  addUser,
  setTyping,
} from "./roomManager";
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./types";

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: "50mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 50 * 1024 * 1024,
});

io.on("connection", (socket) => {
  let currentRoom: string | null = null;
  let userId = socket.id;
  let userName = "";

  socket.on("create_room", (roomName, roomCode) => {
    try {
      const room = createRoom(roomCode, roomName);
      const { user, users } = addUser(room.roomCode, userId);
      userName = user.name;
      currentRoom = room.roomCode;

      socket.join(room.roomCode);
      socket.data.roomCode = room.roomCode;
      socket.data.userId = userId;
      socket.data.userName = userName;

      room.users = users;
      room.lastUpdated = Date.now();

      socket.emit("room_created", room);
      socket.to(room.roomCode).emit("user_joined", user, users);
    } catch (err: any) {
      socket.emit("room_error", err.message);
    }
  });

  socket.on("join_room", (roomCode) => {
    try {
      const room = joinRoom(roomCode);
      const { user, users } = addUser(room.roomCode, userId);
      userName = user.name;
      currentRoom = room.roomCode;

      socket.join(room.roomCode);
      socket.data.roomCode = room.roomCode;
      socket.data.userId = userId;
      socket.data.userName = userName;

      room.users = users;
      room.lastUpdated = Date.now();

      socket.emit("room_joined", room);
      socket.to(room.roomCode).emit("user_joined", user, users);
    } catch (err: any) {
      socket.emit("room_error", err.message);
    }
  });

  socket.on("leave_room", () => {
    if (currentRoom) {
      const users = leaveRoom(currentRoom, userId);
      socket.leave(currentRoom);
      socket.to(currentRoom).emit("user_left", userId, users);
      currentRoom = null;
    }
  });

  socket.on("text_change", (content) => {
    if (currentRoom) {
      try {
        updateText(currentRoom, content);
        socket.to(currentRoom).emit("text_updated", content);
      } catch {
        // Room not found, ignore
      }
    }
  });

  socket.on("upload_image", (imageData) => {
    if (currentRoom) {
      try {
        const image = addImage(currentRoom, imageData, userId);
        io.to(currentRoom).emit("image_added", image);
      } catch (err: any) {
        socket.emit("room_error", err.message);
      }
    }
  });

  socket.on("delete_image", (imageId) => {
    if (currentRoom) {
      try {
        deleteImage(currentRoom, imageId);
        io.to(currentRoom).emit("image_deleted", imageId);
      } catch {
        // Room not found, ignore
      }
    }
  });

  socket.on("typing", (isTyping) => {
    if (currentRoom) {
      setTyping(currentRoom, userId, isTyping);
      socket.to(currentRoom).emit("typing_status", userId, isTyping);
    }
  });

  socket.on("disconnect", () => {
    if (currentRoom) {
      const users = leaveRoom(currentRoom, userId);
      socket.to(currentRoom).emit("user_left", userId, users);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`ClipNote server running on port ${PORT}`);
});
