import emailVerificationTokenRepository from "../repositories/email-verification-token.repository.js";
import type { PoolClient } from "pg";
import cryptoService from "./crypo.service.js";
import {
  EMAIL_VERIFICATION_TOKEN_EXPIRY_MINUTES,
  MILLISECONDS_IN_A_MINUTE,
} from "../config/constants.js";
import type { EmailVerificationTokenFindRepoOutput } from "../types/email-verification-token.types.js";

const create = async (userId: string, client?: PoolClient): Promise<string> => {
  const token = cryptoService.generateToken();
  const tokenHash = cryptoService.hash(token);
  const expiresAt = new Date(
    Date.now() +
      EMAIL_VERIFICATION_TOKEN_EXPIRY_MINUTES * MILLISECONDS_IN_A_MINUTE,
  );
  await emailVerificationTokenRepository.create(
    {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    },
    client,
  );

  return token;
};

const findByToken = (
  token: string,
  client?: PoolClient,
): Promise<EmailVerificationTokenFindRepoOutput | null> => {
  const tokenHash = cryptoService.hash(token);
  return emailVerificationTokenRepository.findByTokenHash(tokenHash, client);
};

const emailVerificationTokenService = {
  create,
  findByToken,
};

export default emailVerificationTokenService;
