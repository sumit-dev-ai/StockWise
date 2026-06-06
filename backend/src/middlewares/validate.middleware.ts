import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ApiError from "../utils/ApiError";


export const validate =
  (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new ApiError(400, message);
    }

    req.body = result.data;
    next();
  };