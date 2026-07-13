import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.js";

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.error(err.message, err.status);
  }

  res.error("Internal Server Error", 500);
}
