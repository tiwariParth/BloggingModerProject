import { Router } from "express";
import { protect } from "../auth/authMiddleware";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postController";

const router = Router();

router.use(protect);

router.route("/").get(getAllPosts).post(createPost);

router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

export default router;
