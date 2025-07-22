import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/ApiError";
import { ZodError, ZodType } from "zod";
ZodError
export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    console.log('middleware.validate: Validando...')
    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.log('middleware.validate: Not success')
      throw new ApiError(
        400,
        "middleware.validate: Zod validation error :(",
        result?.error?.issues?.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })) || {}
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).validated = result.data;
    next();
  };
