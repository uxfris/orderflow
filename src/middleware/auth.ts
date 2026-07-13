import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

interface UserPayload {
  id: string;
  name: string;
  email: string;
}

export default function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.error("Unauthorized", 401);
    }

    req.user = jwt.verify(token!, env.accessSecret) as UserPayload;
    next();
  } catch (error) {
    res.error("Invalid token", 401);
  }
}
