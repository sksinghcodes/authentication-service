import { PoolClient } from "pg";
import pool from "../config/database.js";
import type {
  RefreshTokenCreateRepoInput,
  RefreshTokenFindRepoOutput,
} from "../types/token.type.js";

const create = async (
  tokenInput: RefreshTokenCreateRepoInput,
  client?: PoolClient,
): Promise<void> => {
  const db = client ?? pool;

  const query = {
    text: `
			INSERT INTO refresh_tokens (
				user_id,
				token_hash,
				expires_at,
				created_at,
				device_info,
				user_agent,
				ip_address
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7);
		`,
    values: [
      tokenInput.user_id,
      tokenInput.token_hash,
      tokenInput.expires_at,
      tokenInput.created_at,
      tokenInput.device_info,
      tokenInput.user_agent,
      tokenInput.ip_address,
    ],
  };

  await db.query(query);
};

const deleteByTokenHash = async (tokenHash: string, client?: PoolClient) => {
  const db = client ?? pool;
  const query = {
    text: `
      DELETE
      FROM refresh_tokens
      WHERE token_hash = $1;
    `,
    values: [tokenHash],
  };

  await db.query(query);
};

const findByTokenHash = async (
  tokenHash: string,
  client?: PoolClient,
): Promise<RefreshTokenFindRepoOutput | null> => {
  const db = client ?? pool;
  const query = {
    text: `
      SELECT
        id,
        user_id,
        token_hash,
        expires_at,
        created_at,
        revoked_at,
        device_info,
        user_agent,
        ip_address
      FROM refresh_tokens
      WHERE token_hash = $1
      LIMIT 1;
    `,
    values: [tokenHash],
  };
  const result = await db.query<RefreshTokenFindRepoOutput>(query);
  return result.rows[0] ?? null;
};

const revokeByTokenHash = async (tokenHash: string, client?: PoolClient) => {
  const db = client ?? pool;
  const query = {
    text: `
      UPDATE refresh_tokens
      SET revoked_at = $1
      WHERE token_hash = $2;
    `,
    values: [new Date(), tokenHash],
  };

  await db.query(query);
};

const refreshTokenRepository = {
  create,
  deleteByTokenHash,
  findByTokenHash,
  revokeByTokenHash,
};

export default refreshTokenRepository;
