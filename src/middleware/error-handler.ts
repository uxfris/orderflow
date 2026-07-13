import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.js";

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
}
