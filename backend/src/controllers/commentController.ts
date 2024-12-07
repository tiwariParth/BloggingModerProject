import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { AuthenticatedRequest } from "../auth/authMiddleware";
import { CreateCommentInput, UpdateCommentInput } from "../types/comment.types";

const prisma = new PrismaClient();

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = req.body as CreateCommentInput;
    const postId = parseInt(req.params.postId);
    const userId = req.user?.userId;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: userId } },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      status: "success",
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.postId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.comment.count({ where: { postId } });

    res.status(200).json({
      status: "success",
      data: {
        comments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { content } = req.body as UpdateCommentInput;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.authorId !== userId) {
      throw new AppError("You can only update your own comments", 403);
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: { comment: updatedComment },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.authorId !== userId) {
      throw new AppError("You can only delete your own comments", 403);
    }

    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
