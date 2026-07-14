import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { ZodType } from "zod";

export type ValidatedQueryLocals<T> = { validatedQuery: T };

export default function validateQuery<T>(
  schema: ZodType<T>,
): RequestHandler<
  ParamsDictionary,
  unknown,
  unknown,
  ParsedQs,
  ValidatedQueryLocals<T>
> {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.error("Query validation Failed", 400, result.error.issues);
    }
    res.locals.validatedQuery = result.data;
    next();
  };
}
