import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

interface UserPayload {
  sub: string;
  role: "ADMIN" | "USER";
}

export default function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.error("Unauthorized", 401);
    }

    req.user = jwt.verify(token!, env.accessSecret) as UserPayload;
    next();
  } catch (error) {
    res.error("Invalid token", 401);
  }
}
