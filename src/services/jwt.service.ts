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
import {
  MILLISECONDS_IN_A_SECOND,
  SECONDS_IN_A_DAY,
  SECONDS_IN_A_MINUTE,
} from "../config/constants.js";

const createToken = ({
  userId,
  secret,
  expiresInSeconds,
}: CreateTokenInput): CreateTokenOutput => {
  const iat = Math.floor(Date.now() / MILLISECONDS_IN_A_SECOND);
  const exp = iat + expiresInSeconds;
  const token = jwt.sign({ sub: userId, exp, iat }, secret, {
    algorithm: "HS256",
  });
  return {
    token,
    issuedAt: new Date(iat * MILLISECONDS_IN_A_SECOND),
    expiresAt: new Date(exp * MILLISECONDS_IN_A_SECOND),
  };
};

const createRefreshToken = (userId: string) => {
  return createToken({
    userId,
    secret: JWT_REFRESH_SECRET,
    expiresInSeconds: JWT_REFRESH_EXPIRES_IN_DAYS * SECONDS_IN_A_DAY,
  });
};

const verifyToken = (token: string, secret: string): JwtTokenPayload => {
  return jwt.verify(token, secret, {
    algorithms: ["HS256"],
  }) as JwtTokenPayload;
};

const verifyRefreshToken = (token: string) => {
  return verifyToken(token, JWT_REFRESH_SECRET);
};

const createAccessToken = (userId: string) => {
  return createToken({
    userId,
    secret: JWT_ACCESS_SECRET,
    expiresInSeconds: JWT_ACCESS_EXPIRES_IN_MINUTES * SECONDS_IN_A_MINUTE,
  });
};

const verifyAccessToken = (token: string): JwtTokenPayload => {
  return verifyToken(token, JWT_ACCESS_SECRET);
};

const jwtService = {
  createRefreshToken,
  verifyRefreshToken,
  createAccessToken,
  verifyAccessToken,
};

export default jwtService;
