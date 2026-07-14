import type { NextFunction, Request, Response } from "express";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const asyncHandler = (controller: Controller) => {
  return (req: Request, res: Response, next: NextFunction) => {
    controller(req, res, next).catch(next);
  };
};

export default asyncHandler;
