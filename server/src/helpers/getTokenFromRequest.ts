import { Request } from "express";
import { ApiError } from "./ApiError";

export const getTokenFromRequest = (req: Request): string => {
  if (!req.headers.authorization) {
    throw new ApiError("Non authorized", 401);
  }

  const token = req.headers.authorization.split(" ")[1];
  return token;
};
