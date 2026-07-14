import type { NextFunction, Request, Response } from "express";
import ValidationError from "./ValidattionError.js";

const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: error.message,
      errors: error.errors,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal Server Error",
  });
};

export default errorMiddleware;
