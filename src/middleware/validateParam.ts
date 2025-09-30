import { ApiError } from "@/utils/ApiError";
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateParams =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }))
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).validatedParams = parsed.data;
    next();
  };
