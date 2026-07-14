import type { PoolClient } from "pg";
import pool from "../config/database.js";
import {
  CreateEmailTokenInput,
  EmailVerificationTokenPublic,
} from "../types/email-verification-token.types.js";

const create = async (
  token: CreateEmailTokenInput,
  client?: PoolClient,
): Promise<void> => {
  const db = client ?? pool;
  const query = {
    text: `
			INSERT INTO email_verification_tokens (
				user_id,
				token_hash,
				expires_at
			)
			VALUES ($1, $2, $3);
    `,
    values: [token.user_id, token.token_hash, token.expires_at],
  };

  await db.query(query);
};

const findByTokenHash = async (
  tokenHash: string,
  client?: PoolClient,
): Promise<EmailVerificationTokenPublic | null> => {
  const db = client ?? pool;
  const query = {
    text: `
      SELECT
        id,
        expires_at,
        user_id
      FROM email_verification_tokens
      WHERE token_hash = $1
      LIMIT 1;
    `,
    values: [tokenHash],
  };

  const result = await db.query(query);
  return result.rows[0] ?? null;
};

const deleteByField = async (
  field: "id" | "user_id",
  value: string,
  client?: PoolClient,
): Promise<void> => {
  if (!["id", "user_id"].includes(field)) {
    throw new Error(`Invalid unique field: ${field}`);
  }

  const db = client ?? pool;

  const query = {
    text: `
      DELETE 
      FROM email_verification_tokens
      WHERE ${field} = $1;
    `,
    values: [value],
  };

  await db.query(query);
};

const deleteById = (id: string, client?: PoolClient) => {
  return deleteByField("id", id, client);
};

const deleteByUserId = (userId: string, client?: PoolClient) => {
  return deleteByField("user_id", userId, client);
};

const emailVerificationTokenRepository = {
  create,
  findByTokenHash,
  deleteById,
  deleteByUserId,
};

export default emailVerificationTokenRepository;
