import { Response } from "express";
import { Tokens } from "../types/token.type.js";

const cookieOptions = (path: string) => ({
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path,
});

const setCookie = (res: Response, key: string, value: string, path: string) => {
  res.cookie(key, value, cookieOptions(path));
};

const clearCookie = (res: Response, key: string, path: string) => {
  res.clearCookie(key, cookieOptions(path));
};

const set = (res: Response, token: Tokens): void => {
  setCookie(res, "accessToken", token.accessToken, "/api");
  setCookie(res, "refreshToken", token.refreshToken, "/api/auth");
};

const remove = (res: Response) => {
  clearCookie(res, "accessToken", "/api");
  clearCookie(res, "refreshToken", "/api/auth");
};

const cookieService = {
  set,
  remove,
};

export default cookieService;
