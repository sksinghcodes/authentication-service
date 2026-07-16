import type { Request, Response } from "express";
import authService from "../services/auth.service.js";
import path from "node:path";

const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    await authService.verifyEmail(req.query.token as string);
    res.sendFile(
      path.join(process.cwd(), "src/public", "verification-success.html"),
    );
  } catch {
    res.sendFile(
      path.join(process.cwd(), "src/public", "verification-failed.html"),
    );
  }
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
