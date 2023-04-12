import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { LoginRequest, RefreshTokenRequest, SignupRequest } from "../types/auth.types";

import * as AuthValidations from "../validations/auth.validations";

import * as BlackListService from "../services/tokenBlacklist.service";
import * as UserService from "../services/users.service";
import * as RedisService from "../services/redis.service";

import { generateRefreshToken } from "../helpers/generateRefreshToken";
import { generateAccessToken } from "../helpers/generateAccessToken";
import { verifyRefreshToken } from "../helpers/verifyRefreshToken";
import { withErrorHandling } from "../helpers/withErrorHandling";
import { ApiError } from "../helpers/ApiError";
import { deleteRefreshToken } from "../helpers/deleteRefreshToken";
import { isTokenHasValidSignature } from "../helpers/isTokenHasValidSignature";

const saltRounds = 10;

export const login = withErrorHandling(
  async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const { error } = AuthValidations.loginSchema.validate(req.body);

    if (error) {
      throw new ApiError(error?.message, 400);
    }

    const user = await UserService.getUserByEmail(req.body.email);

    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordCorrect) {
      throw new ApiError("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const redisKey = `user:${user.id}`;

    RedisService.hset(redisKey, "refreshToken", refreshToken);

    res.send({ accessToken, refreshToken });
  }
);

export const signup = withErrorHandling(
  async (req: Request<{}, {}, SignupRequest>, res: Response) => {
    const { error } = AuthValidations.signupSchema.validate(req.body);

    if (error) {
      throw new ApiError(error?.message, 400);
    }

    const user = await UserService.getUserByEmail(req.body.email);

    if (user) {
      throw new ApiError("This email is already in use", 400);
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const createdUserID = await UserService.createUser({
      ...req.body,
      password: hashedPassword,
    });

    if (typeof createdUserID !== "number") {
      throw new ApiError("An error occurred while creating a user", 500);
    }

    const accessToken = await generateAccessToken(createdUserID);
    const refreshToken = await generateRefreshToken(createdUserID);

    const redisKey = `user:${createdUserID}`;

    RedisService.hset(redisKey, "refreshToken", refreshToken);

    res.send({ accessToken, refreshToken });
  }
);

export const logout = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new ApiError("Forbidden", 403);
  }

  const token = authHeader.split(" ")[1];

  BlackListService.addToTheBlackList(token);
  deleteRefreshToken(token);

  res.status(200).send({ message: "Success" });
};

export const refreshToken = withErrorHandling(
  async (req: Request<{}, {}, RefreshTokenRequest>, res: Response) => {
    const { refreshToken } = req.body;
    const decoded = jwt.decode(refreshToken);

    const refreshTokenValid = await verifyRefreshToken(refreshToken);

    if (!refreshTokenValid) {
      throw new ApiError("Forbidden", 403);
    }

    if (!isTokenHasValidSignature(decoded)) {
      throw new ApiError("Forbidden", 403);
    }

    const accessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    const redisKey = `user:${decoded.id}`;

    RedisService.hset(redisKey, "refreshToken", newRefreshToken);

    res.status(200).send({ accessToken, refreshToken: newRefreshToken });
  }
);
