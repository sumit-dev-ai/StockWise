import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { getOnboardingStatus, verifyGoogleToken } from "./auth.service";
import {
  createGoogleUser,
  findUserByGoogleId,
  findUserById,
} from "../user/user.service";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokens";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  const googleUser = await verifyGoogleToken(credential);
  let user = await findUserByGoogleId(googleUser.googleId);

  if (!user) {
    user = await createGoogleUser(googleUser);
  }

  if (!user) {
    throw new ApiError(500, "failed to create user");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  const cookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax" as const,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            profilePicture: user.avatar_url,
          },
        },
        "Google login successful",
      ),
    );
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "unauthorized Request");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const { store, onBoarding } = await getOnboardingStatus(userId);
    return res.status(200).json(
      new ApiResponse(200, {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          profilePicture: user.avatar_url,
        },
        store,
        onBoarding
        
      }),
    );
  },
);

export const logoutUser = asyncHandler(
  async (req: Request, res: Response) => {
    const cookieOptions = {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite:
        env.nodeEnv === "production" ,
    };

    return res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json(new ApiResponse(200, null, "Logout successful"));
  }
);

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    const decoded = jwt.verify(
      refreshToken,
      env.refreshTokenSecret
    ) as {
      id: number;
    };

    const user = await findUserById(decoded.id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (!user.is_active) {
      throw new ApiError(403, "Your account is disabled");
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite:
        env.nodeEnv === "production",
    };

    return res
      .cookie("accessToken", newAccessToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              id: user.id,
              fullName: user.full_name,
              email: user.email,
              profilePicture: user.avatar_url,
            },
          },
          "Access token refreshed successfully"
        )
      );
  }
);