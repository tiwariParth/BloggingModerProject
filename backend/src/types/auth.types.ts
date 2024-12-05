import { Request } from "express";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
}
