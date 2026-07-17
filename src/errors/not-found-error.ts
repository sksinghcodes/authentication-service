import { STATUS_CODE } from "../config/constants.js";
import AppError from "./app-error.js";

export default class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, STATUS_CODE.NOT_FOUND);
  }
}
