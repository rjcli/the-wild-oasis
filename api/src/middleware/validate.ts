import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodEffects, ZodError } from "zod";

import { AppError } from "../utils/AppError";

export const validate =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; ");
        next(new AppError(`Validation error — ${message}`, 400));
      } else {
        next(err);
      }
    }
  };
