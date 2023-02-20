import express from "express";
import {
  getUsers,
  getUser,
  getMatches,
} from "../../controllers/api/userController.js";
import {
  addFight,
  addPass,
  removeMatch,
} from "../../controllers/api/actionsController.js";
import { verifyToken } from "../../middleware/auth.js";
import chatRoutes from "./chatRoutes.js";

const router = express.Router();

// Routes
router.use("/chat", chatRoutes);

// Read
router.get("/users/:id", verifyToken, getUsers);
router.get("/users/:id/matches", verifyToken, getMatches);
router.get("/user/:id", verifyToken, getUser);

// Update
router.patch("/users/:id/actions/fight", verifyToken, addFight);
router.patch("/users/:id/actions/pass", verifyToken, addPass);
router.patch("/users/:id/actions/removeMatch", verifyToken, removeMatch);

export default router;
