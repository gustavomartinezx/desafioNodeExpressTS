import { Router, Request, Response } from "express";
import {
  postLOGIN,
  postUSER,
  getUSERS,
  getUSERID,
  putUSER,
  deleteUSER,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware ";

const router = Router();

router.post("/auth/login", postLOGIN);
router.post("/users", postUSER);
router.get("/users", authMiddleware, getUSERS);
router.get("/users/:id", authMiddleware, getUSERID);
router.put("/users/:id", authMiddleware, putUSER);
router.delete("/users/:id", authMiddleware, deleteUSER);

export default router;
