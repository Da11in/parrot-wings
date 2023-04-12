import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt.config";
import { ApiError } from "./ApiError";

export const generateRefreshToken = (user_id: number) => {
  if (!jwtConfig.refreshTokenSecret) {
    throw new ApiError("Internal api error", 500);
  }

  return jwt.sign({ id: user_id }, jwtConfig.refreshTokenSecret, {
    expiresIn: jwtConfig.refreshTokenExpiresIn,
  });
};
