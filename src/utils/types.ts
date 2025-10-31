import { Request } from "express";

export type ValidatedRequest<
  Params = any,
  Body = any,
  Query = any
> = Request<Params, any, Body, Query> & {
  validated?: Body;
  validatedParams?: Params;
  validatedQuery?: Query;
};