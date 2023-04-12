import jwt from "jsonwebtoken";
import * as RedisService from "./redis.service";
import { isTokenHasValidSignature } from "../helpers/isTokenHasValidSignature";

const ACCESS_TOKEN_EXPIRES = 60 * 15;

const getTokenExpiresIn = (token: string) => {
  const decoded = jwt.decode(token);

  if (isTokenHasValidSignature(decoded) && typeof decoded.exp === "number") {
    const now = +new Date() / 1000;

    const delta = decoded.exp - now;

    return Math.trunc(delta);
  }

  return ACCESS_TOKEN_EXPIRES;
};

export const addToTheBlackList = (token: string) => {
  const tokenRemainingLifetimeInSecond = getTokenExpiresIn(token);

  RedisService.set(token, "blacklist", tokenRemainingLifetimeInSecond);
};

export const isTokenInBlackList = async (token: string | undefined) => {
  if (!token) {
    return true;
  }

  const foundedToken = await RedisService.get(token);

  return foundedToken === "blacklist";
};
