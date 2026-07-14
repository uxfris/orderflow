import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

interface UserPayload {
  sub: string;
  role: string;
}

export default function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      res.error("Unauthorized", 401);
    }

    console.log(token);
    console.log(jwt.verify(token!, env.accessSecret));

    req.user = jwt.verify(token!, env.accessSecret) as UserPayload;
    next();
  } catch (error) {
    res.error("Invalid token", 401);
  }
}
