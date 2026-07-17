import { STATUS_CODE } from "../config/constants.js";
import AppError from "./app-error.js";

export default class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, STATUS_CODE.UNAUTHORIZED);
  }
}
