import { Router } from "express";
import { protect } from "../auth/authMiddleware";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postController";
import {
  createPostValidator,
  updatePostValidator,
} from "../validators/postvalidator";
import { validate } from "../middlewares/validatorMiddleware";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getAllPosts)
  .post(createPostValidator, validate, createPost);

router
  .route("/:id")
  .get(getPost)
  .patch(updatePostValidator, validate, updatePost)
  .delete(deletePost);

export default router;
