import jwt from "jsonwebtoken";

import * as RedisService from "../services/redis.service";
import { isTokenHasValidSignature } from "./isTokenHasValidSignature";

export const deleteRefreshToken = (accessToken: string) => {
  const decoded = jwt.decode(accessToken);

  if (!decoded || !isTokenHasValidSignature(decoded)) {
    return;
  }

  const key = `user:${decoded.id}`;

  RedisService.hdel(key, "refreshToken");
};
