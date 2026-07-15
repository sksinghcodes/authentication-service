import AppError from "./app-error.js";

export default class ValidationError extends AppError {
  constructor(public readonly errors: Record<string, string>) {
    super("Validation failed", 400);
  }
}
