import userRepository from "../repositories/user.repository.js";
import type {
  UserCreateRepoOutput,
  UserLoginRequest,
  UserRegisterRequest,
  UserSelfResponse,
} from "../types/user.type.js";
import { hasOnlyValidCharacters } from "../utils/validation.js";
import ValidationError from "../errors/validation-error.js";
import emailVerificationTokenService from "./email-verification-token.service.js";
import pool from "../config/database.js";
import emailService from "./email.service.js";
import emailVerificationTokenRepository from "../repositories/email-verification-token.repository.js";
import ConflictError from "../errors/conflict-error.js";
import AuthenticationError from "../errors/authentication-error.js";
import ForbiddenError from "../errors/forbidden-error.js";
import jwtService from "./jwt.service.js";
import { Tokens } from "../types/token.type.js";
import bcryptService from "./bcrypt.service.js";
import refreshTokenService from "./refreshToken.service.js";
import jwt from "jsonwebtoken";

const { JsonWebTokenError, TokenExpiredError } = jwt;

const register = async (
  user: UserRegisterRequest,
): Promise<UserSelfResponse> => {
  const trimmedUser = {
    first_name: user.first_name?.trim(),
    last_name: user.last_name?.trim(),
    email: user.email?.trim().toLowerCase(),
    username: user.username?.trim(),
    password: user.password?.trim(),
  };

  const { first_name, last_name, email, username, password } = trimmedUser;

  const validationErrors = {
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  };

  if (first_name) {
    if (first_name.length > 30) {
      validationErrors.first_name =
        "First name length should not be more than 30";
    }
  }

  if (last_name && last_name.length > 30) {
    validationErrors.last_name = "Last name length should not be more than 30";
  }

  if (!email) {
    validationErrors.email = "Email is missing";
  } else if (
    email.length < 5 ||
    !email.includes("@") ||
    !email.includes(".") ||
    email.includes(" ")
  ) {
    validationErrors.email = "Email is invalid";
  }

  if (!username) {
    validationErrors.username = "Username is missing";
  } else if (username.length < 3) {
    validationErrors.username = "Username length should not be less than 3";
  } else if (username.length > 20) {
    validationErrors.username = "Username length should not be more than 20";
  } else if (username.includes(" ")) {
    validationErrors.username = "Username should be without spaces";
  } else {
    const usernameValid = hasOnlyValidCharacters(username, {
      alphabeticLower: true,
      numeric: true,
      otherCharacters: "_.",
    });

    if (!usernameValid.isValid) {
      validationErrors.username =
        "These characters are not allowed in Username " +
        usernameValid.invalidChars.join();
    }
  }

  if (!password) {
    validationErrors.password = "Password is missing";
  } else if (password.length < 8) {
    validationErrors.password = "Password length should not be less than 8";
  } else if (password.length > 30) {
    validationErrors.password = "Password length should not be more than 30";
  } else if (password.includes(" ")) {
    validationErrors.password = "Password should be without spaces";
  } else {
    const passwordValid = hasOnlyValidCharacters(password, {
      alphabeticLower: true,
      alphabeticUpper: true,
      numeric: true,
      otherCharacters: "!@#$^*()-_+=.?",
    });

    if (!passwordValid.isValid) {
      validationErrors.password =
        "These characters are not allowed in Password " +
        passwordValid.invalidChars.join();
    }
  }

  const hasErrors = Object.values(validationErrors).some(Boolean);

  if (hasErrors) {
    throw new ValidationError(validationErrors);
  }

  const [resultByEmail, resultByUsername] = await Promise.all([
    userRepository.findByEmail(email),
    userRepository.findByUsername(username),
  ]);

  if (resultByEmail) {
    throw new ConflictError("Email already exists");
  }

  if (resultByUsername) {
    throw new ConflictError("Username already exists");
  }

  const password_hash = await bcryptService.hash(password);

  let newUser: UserCreateRepoOutput;
  let token: string;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    newUser = await userRepository.create(
      {
        first_name: first_name || null,
        last_name: last_name || null,
        email,
        username,
        password_hash,
      },
      client,
    );

    token = await emailVerificationTokenService.create(newUser.id, client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const userResponse = {
    id: newUser.id,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    username: newUser.username,
    email: newUser.email,
    email_is_verified: false,
  };

  await emailService.sendVerificationEmail(userResponse.email, token);
  return userResponse;
};

const verifyEmail = async (token: string) => {
  if (!token) {
    throw new ValidationError({ token: "No token provided" });
  }

  const verificationToken =
    await emailVerificationTokenService.findByToken(token);

  if (!verificationToken) {
    throw new ValidationError({
      token: "Invalid or expired email verification token",
    });
  }

  if (verificationToken.expires_at.getTime() < Date.now()) {
    await emailVerificationTokenRepository.deleteById(verificationToken.id);
    throw new ValidationError({
      token: "Invalid or expired email verification token",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await emailVerificationTokenRepository.deleteByUserId(
      verificationToken.user_id,
      client,
    );

    await userRepository.markEmailAsVerified(verificationToken.user_id, client);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const login = async (credentials: UserLoginRequest, cookies: Tokens) => {
  const safeCookies: Tokens = {
    accessToken: cookies?.accessToken || "",
    refreshToken: cookies?.refreshToken || "",
  };

  const trimmedCredentials = {
    usernameOrEmail: credentials?.usernameOrEmail?.trim().toLowerCase(),
    password: credentials?.password?.trim(),
  };

  const { usernameOrEmail, password } = trimmedCredentials;

  if (!usernameOrEmail || !password) {
    throw new ValidationError({
      creadentials: "Invalid credentials",
    });
  }

  const user = await userRepository.findByUsernameOrEmail(usernameOrEmail);

  if (!user) {
    throw new AuthenticationError("Invalid credentials");
  }

  if (!user.email_verified_at) {
    throw new ForbiddenError("Email is not verified");
  }

  const passwordIsCorrect = await bcryptService.compare(
    password,
    user.password_hash,
  );

  if (!passwordIsCorrect) {
    throw new AuthenticationError("Invalid credentials");
  }

  const tokens = jwtService.createAuthTokens(user.id);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await refreshTokenService.store(
      {
        userId: user.id,
        tokenInfo: tokens.refreshToken,
        deviceInfo: null,
        userAgent: null,
        ipAddress: null,
      },
      client,
    );

    if (safeCookies.refreshToken) {
      await refreshTokenService.deleteByToken(safeCookies.refreshToken, client);
    }
    await client.query("COMMIT");
    return {
      accessToken: tokens.accessToken.value,
      refreshToken: tokens.refreshToken.value,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const refresh = async (cookies: Tokens): Promise<Tokens> => {
  const safeCookies: Tokens = {
    accessToken: cookies?.accessToken || "",
    refreshToken: cookies?.refreshToken || "",
  };

  // if it throws an error, global error handler catches it
  const refreshTokenDecoded = jwtService.verifyRefreshToken(
    safeCookies.refreshToken,
  );

  if (safeCookies.accessToken) {
    try {
      jwtService.verifyAccessToken(safeCookies.accessToken);
    } catch (error) {
      // access token may be expired but should not be invalid
      if (!(error instanceof TokenExpiredError)) {
        throw error;
      }
    }
  }

  const refreshToken = await refreshTokenService.findByToken(
    safeCookies.refreshToken,
  );

  if (!refreshToken || refreshToken.user_id !== refreshTokenDecoded.sub) {
    throw new JsonWebTokenError("jwt malformed");
  }

  if (refreshToken.revoked_at) {
    throw new JsonWebTokenError("jwt revoked");
  }

  if (refreshToken.expires_at.getTime() < Date.now()) {
    throw new TokenExpiredError("jwt expired", refreshToken.expires_at);
  }

  const newTokens = jwtService.createAuthTokens(refreshToken.user_id);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await refreshTokenService.store(
      {
        userId: refreshToken.user_id,
        tokenInfo: newTokens.refreshToken,
        deviceInfo: null,
        userAgent: null,
        ipAddress: null,
      },
      client,
    );

    await refreshTokenService.revokeByToken(safeCookies.refreshToken, client);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return {
    refreshToken: newTokens.refreshToken.value,
    accessToken: newTokens.accessToken.value,
  };
};

const authService = {
  register,
  verifyEmail,
  refresh,
  login,
};

export default authService;
