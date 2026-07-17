import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/app-error.js";
import ValidationError from "../errors/validation-error.js";
import jwt from "jsonwebtoken";

const { JsonWebTokenError, TokenExpiredError } = jwt;

const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errors: error.errors,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (
    error instanceof TokenExpiredError ||
    error instanceof JsonWebTokenError
  ) {
    return res.status(401).json({
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal Server Error",
  });
};

export default errorMiddleware;
