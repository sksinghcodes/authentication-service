import { Response } from "express";
import { Tokens } from "../types/token.type.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_PATH,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_PATH,
} from "../config/constants.js";

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
  setCookie(
    res,
    ACCESS_TOKEN_COOKIE_NAME,
    token.accessToken,
    ACCESS_TOKEN_COOKIE_PATH,
  );
  setCookie(
    res,
    REFRESH_TOKEN_COOKIE_NAME,
    token.refreshToken,
    REFRESH_TOKEN_COOKIE_PATH,
  );
};

const remove = (res: Response) => {
  clearCookie(res, ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_COOKIE_PATH);
  clearCookie(res, REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_PATH);
};

const cookieService = {
  set,
  remove,
};

export default cookieService;
