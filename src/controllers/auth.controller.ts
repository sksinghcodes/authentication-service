import type { Request, Response } from "express";
import authService from "../services/auth.service.js";
import path from "node:path";
import { Tokens } from "../types/token.type.js";
import cookieService from "../services/cookie.service.js";
import { STATUS_CODE } from "../config/constants.js";

const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(STATUS_CODE.CREATED).json(user);
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
  res.status(STATUS_CODE.OK).json({ success: true });
};

const refresh = async (req: Request, res: Response) => {
  const tokens = await authService.refresh(req.cookies as Tokens);
  cookieService.set(res, tokens);
  res.status(STATUS_CODE.OK).json({ success: true });
};

const logout = async (req: Request, res: Response) => {
  await authService.logout(req.cookies as Tokens);
  cookieService.remove(res);
  res.status(STATUS_CODE.OK).json({ success: true });
};

const authController = {
  register,
  verifyEmail,
  refresh,
  login,
  logout,
};

export default authController;
