import type { NextFunction, Request, Response } from "express";

export default function response(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.success = <T>(
    data: T,
    message = "Success",
    status = 200,
    meta?: unknown,
  ) => {
    return res.status(status).json({
      success: true,
      message: message,
      data: data,
      ...(meta !== undefined && { meta }),
    });
  };

  res.error = (message = "Error", status = 500, errors?: unknown) => {
    return res.status(status).json({
      success: false,
      message: message,
      data: null,
      ...(errors !== undefined && { errors }),
    });
  };

  next();
}
