import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as BlackListService from "../services/tokenBlacklist.service";
import { jwtConfig } from "../configs/jwt.config";

const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const isTokenInBlackList = await BlackListService.isTokenInBlackList(token);

    if (!authHeader || !token || isTokenInBlackList) {
      return res.status(401).send({ message: "Non authorized" });
    }

    if (!jwtConfig.accessTokenSecret) {
      return res.status(500).send({ message: "Internal api error" });
    }

    await jwt.verify(token, jwtConfig.accessTokenSecret);

    return next();
  } catch (err) {
    return res.status(401).send({ message: "Non authorized" });
  }
};

export default protectedRoute;
