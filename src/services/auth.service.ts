import bcrypt from "bcrypt";
import userRepository from "../repositories/user.repository.js";
import { SALT_ROUNDS } from "../config/env.js";
import type {
  UserRegisterRequest,
  UserSelfResponse,
} from "../types/user.type.js";
import { hasOnlyValidCharacters } from "../utils/validation.js";
import ValidationError from "../errors/validation-error.js";
import emailVerificationTokenService from "./email-verification-token.service.js";
import pool from "../config/database.js";
import emailService from "./email.service.js";
import emailVerificationTokenRepository from "../repositories/email-verification-token.repository.js";

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
  } else {
    const result = await userRepository.findByEmail(email);
    if (result) {
      validationErrors.email = "Email already exists";
    }
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

    if (usernameValid.isValid) {
      const result = await userRepository.findByUsername(username);
      if (result) {
        validationErrors.username = "Username already exists";
      }
    } else {
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

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const newUser = await userRepository.create(
      {
        first_name: first_name || null,
        last_name: last_name || null,
        email,
        username,
        password_hash,
      },
      client,
    );

    const userResponse: UserSelfResponse = {
      id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      username: newUser.username,
      email: newUser.email,
      email_is_verified: false,
    };

    const token = await emailVerificationTokenService.create(
      newUser.id,
      client,
    );

    await client.query("COMMIT");
    await emailService.sendVerificationEmail(newUser.email, token);
    return userResponse;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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

const authService = {
  register,
  verifyEmail,
};

export default authService;
