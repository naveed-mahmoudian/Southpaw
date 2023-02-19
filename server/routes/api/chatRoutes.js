import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import User from "../../models/User.js";
import Message from "../../models/Message.js";

dotenv.config();

// Variables
const router = express.Router();
const httpServer = createServer();
// const SOCKET_PORT = process.env.SOCKET_PORT || 8080;

// Configurations
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000/home"],
    methods: ["GET", "POST"],
  },
  path: "/api/chat",
});

// Web Socket
router.get("/", (req, res) => {
  io.on("connection", (socket) => {
    socket.on("send_message", async (data) => {
      console.log("CONNECTED", data);
      io.to(data.receiver).emit("receive_message", data);

      // const newMessage = await Message.create({
      //   fromId: data.fromId,
      //   toId: data.toId,
      //   message: data.message,
      // });

      // const updatedUserMessage = await User.findByIdAndUpdate(
      //   data.fromId,
      //   { $push: { messages: newMessage._id } },
      //   { new: true }
      // );

      // socket.broadcast.emit("receive-message", data.message);
    });
  });
});

export default router;
