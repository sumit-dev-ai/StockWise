import jwt from "jsonwebtoken";
import { env } from "../config/env";

type AccessTokenPayload = {
  id: number;
  email: string;
};

type RefreshTokenPayload = {
  id: number;
};

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, env.accessTokenSecret, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, env.refreshTokenSecret, {
    expiresIn: "7d",
  });
};