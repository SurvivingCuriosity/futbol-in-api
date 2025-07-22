import { NextFunction, Request, Response } from "express";

export const responseHandler =
  (controller: (...args: any[]) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('middleware.responseHandler: Llamando a controlador...')
      const result = await controller(req, res, next);
      console.log('middleware.responseHandler: statusCode del controlador: ', result.statusCode)
      if (result?.statusCode) res.status(result.statusCode);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
