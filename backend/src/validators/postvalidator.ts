import { check } from "express-validator";

export const createPostValidator = [
  check("title").notEmpty().withMessage("Title is required"),
  check("content").notEmpty().withMessage("Content is required"),
];

export const updatePostValidator = [
  check("title").optional().notEmpty().withMessage("Title cannot be empty"),
  check("content").optional().notEmpty().withMessage("Content cannot be empty"),
];
