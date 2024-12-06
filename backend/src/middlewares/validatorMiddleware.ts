import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError("Validation Error", 422, errors.array());
  }
  next();
};
