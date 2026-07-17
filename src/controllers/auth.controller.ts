import type { Request, Response } from "express";
import authService from "../services/auth.service.js";
import path from "node:path";
import { Tokens } from "../types/token.type.js";
import cookieService from "../services/cookie.service.js";

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
  const tokens = await authService.login(req.body, req.cookies as Tokens);
  cookieService.set(res, tokens);
  res.status(200).json({ success: true });
};

const refresh = async (req: Request, res: Response) => {
  const tokens = await authService.refresh(req.cookies as Tokens);
  cookieService.set(res, tokens);
  res.status(200).json({ success: true });
};

const authController = {
  register,
  verifyEmail,
  refresh,
  login,
};

export default authController;
