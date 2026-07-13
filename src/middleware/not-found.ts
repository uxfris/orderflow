import type { NextFunction, Request, Response } from "express";

export default function notFound(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.error("Route not found", 404);
}
