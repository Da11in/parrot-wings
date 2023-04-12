import jwt from "jsonwebtoken";
import { isTokenHasValidSignature } from "./isTokenHasValidSignature";
import { ApiError } from "./ApiError";

export const getUserIdFromToken = (token: string): number => {
  const decoded = jwt.decode(token);

  if (!isTokenHasValidSignature(decoded)) {
    throw new ApiError("Non authorized", 401);
  }

  return Number(decoded.id);
};
