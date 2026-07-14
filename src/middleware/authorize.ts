import type { NextFunction, Request, Response } from "express";

export default function authorize(...roles: ("ADMIN" | "USER")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.error("Unauthorized", 401);
    }
    if (!roles.includes(req.user.role)) {
      return res.error("Forbidden", 403);
    }
    next();
  };
}
