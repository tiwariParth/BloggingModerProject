import express from "express";
import { protect } from "../auth/authMiddleware";
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

const router = express.Router();

router.use(protect);

router.post("/posts/:postId/comments", createComment);

router.get("/posts/:postId/comments", getPostComments);

router.patch("/comments/:id", updateComment);

router.delete("/comments/:id", deleteComment);

export default router;
