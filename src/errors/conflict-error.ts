import { STATUS_CODE } from "../config/constants.js";
import AppError from "./app-error.js";

export default class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, STATUS_CODE.CONFLICT);
  }
}
