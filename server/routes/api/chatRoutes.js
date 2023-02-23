import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import User from "../../models/User.js";
import Message from "../../models/Message.js";

// dotenv.config();

// Variables
// const app = express();
const router = express.Router();
// const httpServer = createServer(app);
// const SOCKET_PORT = process.env.SOCKET_PORT || 8080;

// Configurations
// const io = new Server(httpServer, {
//   cors: {
//     origin: ["http://localhost:3000/chat"],
//     methods: ["GET", "POST"],
//   },
// });

// Get Route
// router.get("/", (req, res) => {
//   res.status(200).json({ msg: "chat" });
// });

// Web Socket
// io.on("connection", (socket) => {
//   console.log("CONNECTED", socket);
// });

// httpServer.listen(SOCKET_PORT, () => {
//   console.log(`Listening on port: ${SOCKET_PORT}`);
// });

export default router;
