import { PoolClient } from "pg";
import pool from "../config/database.js";
import type { RefreshTokenCreateRepoInput } from "../types/token.type.js";

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

const refreshTokenRepository = {
  create,
};

export default refreshTokenRepository;
