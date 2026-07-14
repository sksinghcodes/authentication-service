import crypto from "node:crypto";
import emailVerificationTokenRepository from "../repositories/email-verification-token.repository.js";
import type { PoolClient } from "pg";

const create = async (user_id: string, client?: PoolClient) => {
  const token = crypto.randomBytes(32).toString("hex");
  const token_hash = crypto.createHash("sha256").update(token).digest("hex");
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
  const token_hash = crypto.createHash("sha256").update(token).digest("hex");
  return emailVerificationTokenRepository.findByTokenHash(token_hash);
};

const emailVerificationTokenService = {
  create,
  findByToken,
};

export default emailVerificationTokenService;
