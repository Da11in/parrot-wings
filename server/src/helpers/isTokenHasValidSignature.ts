import { JwtPayload } from "jsonwebtoken";

export const isTokenHasValidSignature = (token: unknown): token is JwtPayload =>
  (token as JwtPayload).id !== undefined;
