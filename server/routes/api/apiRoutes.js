import express from "express";
import {
  getUsers,
  getUser,
  getMatches,
  getMessages,
} from "../../controllers/api/userController.js";
import {
  addFight,
  addPass,
  removeMatch,
  sendMessage,
} from "../../controllers/api/actionsController.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

// Read
router.get("/users/:id", verifyToken, getUsers);
router.get("/users/:id/matches", verifyToken, getMatches);
router.get("/user/:id", verifyToken, getUser);
router.get("/users/:id/:userId/messages", verifyToken, getMessages);

// Update
router.patch("/users/:id/actions/fight", verifyToken, addFight);
router.patch("/users/:id/actions/pass", verifyToken, addPass);
router.patch("/users/:id/actions/removeMatch", verifyToken, removeMatch);

// Create
router.post("/users/:id/actions/sendMessage", verifyToken, sendMessage);

export default router;
