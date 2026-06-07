import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import  ApiError  from "../utils/ApiError";

type AccessTokenPayload = {
  id: number;
  email: string;
};

export const verifyAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
      const decoded = jwt.verify(
    token,
    env.accessTokenSecret
  ) as AccessTokenPayload;

  req.user = decoded;

  next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized request");
  }

};