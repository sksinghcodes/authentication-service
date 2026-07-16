import emailVerificationTokenRepository from "../repositories/email-verification-token.repository.js";
import type { PoolClient } from "pg";
import cryptoService from "./crypo.service.js";

const create = async (user_id: string, client?: PoolClient) => {
  const token = cryptoService.generateToken();
  const token_hash = cryptoService.hash(token);
  const expires_at = new Date(Date.now() + 10 * 60 * 1000);
  await emailVerificationTokenRepository.create(
    {
      user_id,
      token_hash,
      expires_at,
    },
    client,
  );

  return token;
};

const findByToken = (token: string) => {
  const token_hash = cryptoService.hash(token);
  return emailVerificationTokenRepository.findByTokenHash(token_hash);
};

const emailVerificationTokenService = {
  create,
  findByToken,
};

export default emailVerificationTokenService;
