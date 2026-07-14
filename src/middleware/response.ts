import type { NextFunction, Request, Response } from "express";
import snakecaseKeys from "snakecase-keys";

export default function response(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    return originalJson(snakecaseKeys(body, { deep: true }));
  };

  res.success = <T>(
    data: T,
    message = "Success",
    status = 200,
    meta?: unknown,
  ) => {
    return res.status(status).json({
      success: true,
      message,
      data,
      ...(meta !== undefined && { meta }),
    });
  };

  res.error = (message = "Error", status = 500, errors?: unknown) => {
    return res.status(status).json({
      success: false,
      message,
      data: null,
      ...(errors !== undefined && { errors }),
    });
  };

  next();
}
