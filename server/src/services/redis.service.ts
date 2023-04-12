import * as redis from "redis";

const redisClient = redis.createClient();

redisClient
  .connect()
  .then(() => {
    console.log("Redis connected");
  })
  .catch((err) => {
    console.log("Can not connect redis");
    console.log(err);
  });

export const hget = async (key: string, field: string) => {
  const value = await redisClient.hGet(key, field);
  return value;
};

export const get = async (key: string) => {
  const value = await redisClient.get(key);
  return value;
};

export const hset = async (key: string, field: string, value: string, expiresIn?: number) => {
  await redisClient.hSet(key, field, value);

  if (expiresIn) {
    redisClient.expire(key, expiresIn);
  }
};

export const set = async (key: string, value: string, expiresIn?: number) => {
  await redisClient.set(key, value);

  if (expiresIn) {
    redisClient.expire(key, expiresIn);
  }
};

export const hdel = async (key: string, field: string) => {
  await redisClient.hDel(key, field);
};

export const del = async (key: string) => {
  await redisClient.del(key);
};
