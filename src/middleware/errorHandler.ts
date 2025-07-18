import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/apiError";
import { fail } from "@/utils/apiResponse";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const apiErr =
    err instanceof ApiError ? err : new ApiError(500, "Unexpected error");
  res
    .status(apiErr.statusCode)
    .json(
      fail(apiErr.payload ?? apiErr.message, apiErr.message, apiErr.statusCode)
    );
};
