import type { Request, Response } from "express";
import authService from "../services/auth.service.js";

const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
};

const verifyEmail = async (req: Request, res: Response) => {
  await authService.verifyEmail(req.body.token);
  res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
};

const authController = {
  register,
  verifyEmail,
};

export default authController;
