import { PoolClient } from "pg";
import pool from "../config/database.js";
import {
  PasswordResetTokenCreateRepoInput,
  PasswordResetTokenFindRepoOutput,
} from "../types/password-reset-token.types.js";

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

const findByTokenHash = async (
  tokenHash: string,
  client?: PoolClient,
): Promise<PasswordResetTokenFindRepoOutput | null> => {
  const db = client ?? pool;

  const query = {
    text: `
      SELECT
        id,
        user_id,
        expires_at
      FROM password_reset_tokens
      WHERE token_hash = $1
      LIMIT 1;
    `,
    values: [tokenHash],
  };

  const result = await db.query<PasswordResetTokenFindRepoOutput>(query);
  return result.rows[0] ?? null;
};

const deleteByField = async (
  field: "id" | "user_id",
  value: string,
  client?: PoolClient,
): Promise<void> => {
  const db = client ?? pool;

  const query = {
    text: `
      DELETE
      FROM password_reset_tokens
      WHERE ${field} = $1;
    `,
    values: [value],
  };

  await db.query(query);
};

const deleteAllByUserId = async (
  userId: string,
  client?: PoolClient,
): Promise<void> => {
  await deleteByField("user_id", userId, client);
};

const deleteById = async (id: string, client?: PoolClient): Promise<void> => {
  await deleteByField("id", id, client);
};

const passwordResetTokenRepository = {
  create,
  findByTokenHash,
  deleteAllByUserId,
  deleteById,
};

export default passwordResetTokenRepository;
