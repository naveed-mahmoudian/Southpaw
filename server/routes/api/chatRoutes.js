import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import User from "../../models/User.js";
import Message from "../../models/Message.js";

dotenv.config();

// Variables
const router = express.Router();
const SOCKET_PORT = process.env.SOCKET_PORT || 8080;

// Configurations
const io = new Server(SOCKET_PORT, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

// Web Socket
io.on("connection", (socket) => {
  socket.on("send-message", async (data) => {
    const newMessage = await Message.create({
      fromId: data.fromId,
      toId: data.toId,
      message: data.message,
    });

    const updatedUserMessage = await User.findByIdAndUpdate(
      data.fromId,
      { $push: { messages: newMessage._id } },
      { new: true }
    );

    socket.broadcast.emit("receive-message", data.message);
  });
});

export default router;
