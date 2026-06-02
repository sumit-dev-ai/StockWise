// src/middlewares/error.middleware.ts

import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

const errorMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: unknown[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else {
    message = err.message || message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    data: null,
  });
};

export default errorMiddleware;