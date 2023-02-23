// Imports
import express, { urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createServer } from "http";
import getChatRoomId from "./utils/getChatRoomId.js";

// Route Imports
import authRoutes from "./routes/auth/authRoutes.js";
import apiRoutes from "./routes/api/apiRoutes.js";

// Controller Imports
import { signup } from "./controllers/auth/authController.js";

// Configurations
dotenv.config();
const PORT = process.env.PORT || 3001;
const SOCKET_PORT = process.env.SOCKET_PORT || 8080;
const appSocket = express();
const httpServer = createServer(appSocket);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
const dbName = "southpawDB";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

appSocket.get("/", (req, res) => {
  res.json({ msg: "chat" });
});

// Web Socket
io.on("connection", (socket) => {
  console.log("USER CONNECTED");

  socket.on("join room", async ({ fromUserId, toUserId }) => {
    try {
      const chatRoomId = await getChatRoomId(fromUserId, toUserId);
      socket.join(chatRoomId);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("private message", async ({ message, fromUser, toUser }) => {
    const chatRoomId = await getChatRoomId(fromUser, toUser);
    const content = { message, fromUser, toUser };

    io.to(chatRoomId).emit("private message", content);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

// File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Routes With Files
app.post("/auth/signup", upload.single("picture"), signup);

// Routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

// Mongoose Setup
mongoose.set({ strictQuery: false });
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: dbName,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`LIVE: http://localhost:${PORT}`));
  })
  .catch((error) => console.log(error));

httpServer.listen(SOCKET_PORT, () => {
  console.log(`Socket Server live at: ${SOCKET_PORT}`);
});
