import { googleClient } from "../../config/google";
import { env } from "../../config/env";
import ApiError from "../../utils/ApiError";


export const verifyGoogleToken = async (credential: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new ApiError(401, "Invalid Google token");
  }

  if (!payload.email) {
    throw new ApiError(400, "Google account email not found");
  }

  if (!payload.email_verified) {
    throw new ApiError(401, "Google email is not verified");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    fullName: payload.name || payload.email.split("@")[0],
    profilePicture: payload.picture || null,
  };
};