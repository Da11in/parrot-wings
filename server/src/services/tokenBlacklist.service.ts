import * as RedisService from "./redis.service";

const MAX_ACCESS_TOKEN_LIFETIME = 300; //seconds = 5 min

export const addToTheBlackList = (token: string) => {
  RedisService.set(token, "", MAX_ACCESS_TOKEN_LIFETIME);
};

export const isTokenInBlackList = async (token: string) => {
  const foundedToken = await RedisService.get(token);
  return foundedToken === undefined;
};
