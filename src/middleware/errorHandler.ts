import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/ApiError";
import { fail } from "@/utils/ApiResponse";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log('middleware.errorHandler: Error: ', err)
  const apiErr =
    err instanceof ApiError ? err : new ApiError(500, "Unexpected error");
  res
    .status(apiErr.statusCode)
    .json(
      fail(apiErr.payload ?? apiErr.message, apiErr.message, apiErr.statusCode)
    );
};
