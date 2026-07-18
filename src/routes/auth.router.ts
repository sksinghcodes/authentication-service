import express from "express";
import authController from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const authRouter = express.Router({
  caseSensitive: true,
  strict: true,
});

authRouter.post("/register", asyncHandler(authController.register));
authRouter.post("/login", asyncHandler(authController.login));
authRouter.post("/verify-email", asyncHandler(authController.verifyEmail));
authRouter.post(
  "/request-email-verification",
  asyncHandler(authController.requestEmailVerification),
);
authRouter.post("/refresh", asyncHandler(authController.refresh));
authRouter.post("/logout", asyncHandler(authController.logout));

export default authRouter;
