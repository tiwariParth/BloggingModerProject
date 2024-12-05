import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./authUtils";
import { AppError } from "../utils/AppError";
import { JWTPayload } from "../types/auth.types";

// Correctly extend the Request interface
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
  cookies: {
    [key: string]: any; // This matches Express's Record<string, any>
    jwt?: string;
  };
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;
    const authHeader = req.header("Authorization");

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new AppError(
        "You are not logged in. Please log in to get access.",
        401
      );
    }

    // 2) Verify token
    const decoded = verifyToken(token);

    // 3) Add user to request
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
