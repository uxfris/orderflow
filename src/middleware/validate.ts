import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export default function validate<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  };
}
