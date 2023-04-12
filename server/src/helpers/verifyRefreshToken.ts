import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt.config";
import { ApiError } from "./ApiError";

export const verifyRefreshToken = async (token: string): Promise<boolean> => {
  if (!jwtConfig.refreshTokenSecret) {
    throw new ApiError("Internal api error", 500);
  }

  try {
    await jwt.verify(token, jwtConfig.refreshTokenSecret);
    return true;
  } catch (err) {
    return false;
  }
};
