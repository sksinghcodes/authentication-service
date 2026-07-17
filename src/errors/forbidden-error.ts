import { STATUS_CODE } from "../config/constants.js";
import AppError from "./app-error.js";

export default class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, STATUS_CODE.FORBIDDEN);
  }
}
