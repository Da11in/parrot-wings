import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";

const isError = (err: unknown): err is Error => (err as Error).message !== undefined;
const isApiError = (err: unknown): err is ApiError => (err as ApiError).code !== undefined;

type Controller = (req: Request, res: Response) => Promise<void>;

export const withErrorHandling =
  (controller: Controller) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
      next();
    } catch (err) {
      if (isApiError(err)) {
        return next(err);
      }

      if (isError(err)) {
        return next(new ApiError(err.message, 500));
      }

      return next(err);
    }
  };
