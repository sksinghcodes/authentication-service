import { PoolClient } from "pg";
import pool from "../config/database.js";
import { PasswordResetTokenCreateRepoInput } from "../types/password-reset-token.types.js";

const create = async (
  tokenInput: PasswordResetTokenCreateRepoInput,
  client?: PoolClient,
): Promise<void> => {
  const db = client ?? pool;

  const query = {
    text: `
      INSERT INTO password_reset_tokens (
        user_id,
        token_hash,
        expires_at
      )
      VALUES ($1, $2, $3);
    `,
    values: [tokenInput.user_id, tokenInput.token_hash, tokenInput.expires_at],
  };
  await db.query(query);
};

const passwordResetTokenRepository = {
  create,
};

export default passwordResetTokenRepository;
