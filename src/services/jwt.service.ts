import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_EXPIRES_IN_MINUTES,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRES_IN_DAYS,
  JWT_REFRESH_SECRET,
} from "../config/env.js";
import type {
  CreateTokenInput,
  CreateTokenOutput,
  JwtTokenPayload,
} from "../types/token.type.js";

const createToken = ({
  userId,
  secret,
  expiresInSeconds,
}: CreateTokenInput): CreateTokenOutput => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;
  const token = jwt.sign({ sub: userId, exp, iat }, secret, {
    algorithm: "HS256",
  });
  return {
    token,
    issuedAt: new Date(iat * 1000),
    expiresAt: new Date(exp * 1000),
  };
};

const createRefreshToken = (userId: string) => {
  return createToken({
    userId,
    secret: JWT_REFRESH_SECRET,
    expiresInSeconds: JWT_REFRESH_EXPIRES_IN_DAYS * 60 * 60 * 24,
  });
};

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET, {
    algorithms: ["HS256"],
  }) as JwtTokenPayload;
};

const createAccessToken = (userId: string) => {
  return createToken({
    userId,
    secret: JWT_ACCESS_SECRET,
    expiresInSeconds: JWT_ACCESS_EXPIRES_IN_MINUTES * 60,
  });
};

const verifyAccessToken = (token: string): JwtTokenPayload => {
  return jwt.verify(token, JWT_ACCESS_SECRET, {
    algorithms: ["HS256"],
  }) as JwtTokenPayload;
};

const jwtService = {
  createRefreshToken,
  verifyRefreshToken,
  createAccessToken,
  verifyAccessToken,
};

export default jwtService;
