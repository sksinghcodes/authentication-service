import { PoolClient } from "pg";
import cryptoService from "./crypo.service.js";
import passwordResetTokenRepository from "../repositories/password-reset-token.repository.js";
import {
  MILLISECONDS_IN_A_MINUTE,
  PASSWORD_RESET_TOKEN_EXPIRY_MINUTES,
} from "../config/constants.js";
import { PasswordResetTokenFindRepoOutput } from "../types/password-reset-token.types.js";

const create = async (userId: string, client?: PoolClient): Promise<string> => {
  const token = cryptoService.generateToken();
  const tokenHash = cryptoService.hash(token);
  const expiresAt = new Date(
    Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MINUTES * MILLISECONDS_IN_A_MINUTE,
  );

  await passwordResetTokenRepository.create(
    {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    },
    client,
  );

  return token;
};

const findByToken = async (
  token: string,
  client?: PoolClient,
): Promise<PasswordResetTokenFindRepoOutput | null> => {
  const tokenHash = cryptoService.hash(token);
  return passwordResetTokenRepository.findByTokenHash(tokenHash, client);
};

const passwordResetTokenService = {
  create,
  findByToken,
};

export default passwordResetTokenService;
