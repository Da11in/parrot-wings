import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { ApiError } from "../helpers/ApiError";

const errorMiddleware = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  if (err.code || err instanceof ApiError) {
    res.status(err.code).send(createHttpError(err.message));
  } else res.status(500).send(err);
};

export default errorMiddleware;
