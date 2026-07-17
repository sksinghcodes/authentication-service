import { STATUS_CODE } from "../config/constants.js";
import AppError from "./app-error.js";

export default class ValidationError extends AppError {
  constructor(public readonly errors: Record<string, string>) {
    super("Validation failed", STATUS_CODE.BAD_REQUEST);
  }
}
