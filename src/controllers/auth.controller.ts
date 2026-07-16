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

const login = async (req: Request, res: Response) => {
  const tokens = await authService.login(req.body);

  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/auth/request-access-token",
  });

  res.status(200).json({ success: true });
};

const authController = {
  register,
  verifyEmail,
  login,
};

export default authController;
