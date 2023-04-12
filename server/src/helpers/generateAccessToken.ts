import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt.config";
import { ApiError } from "./ApiError";

export const generateAccessToken = (user_id: number) => {
  if (!jwtConfig.accessTokenSecret) {
    throw new ApiError("Internal api error", 500);
  }

  return jwt.sign({ id: user_id }, jwtConfig.accessTokenSecret, {
    expiresIn: jwtConfig.accessTokenExpiresIn,
  });
};
