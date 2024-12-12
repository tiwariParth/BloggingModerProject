import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { LoginInput, RegisterInput } from "../types/auth.types";
import { AppError } from "../utils/AppError";
import {
  generateToken,
  hashPassword,
  comparePasswords,
} from "../auth/authUtils";

const prisma = new PrismaClient();

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await comparePasswords(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
