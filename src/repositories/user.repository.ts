import type { PoolClient } from "pg";
import pool from "../config/database.js";
import type { CreateUserInput, RegisteredUser } from "../types/user.type.js";

const create = async (
  user: CreateUserInput,
  client?: PoolClient,
): Promise<RegisteredUser> => {
  const db = client ?? pool;
  const query = {
    text: `
			INSERT INTO users (
				first_name,
				last_name,
				username,
				email,
				password_hash
			)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING
        id,
        first_name,
        last_name,
        username,
        email;
    `,
    values: [
      user.first_name,
      user.last_name,
      user.username,
      user.email,
      user.password_hash,
    ],
  };

  const result = await db.query<RegisteredUser>(query);
  return result.rows[0];
};

const findByUniqueKey = async (
  field: "email" | "username",
  value: string,
  client?: PoolClient,
): Promise<RegisteredUser | null> => {
  const db = client ?? pool;

  const query = {
    text: `
      SELECT
        id,
        first_name,
        last_name,
        username,
        email
      FROM users
      WHERE ${field} = $1
      LIMIT 1;
    `,
    values: [value],
  };

  const result = await db.query<RegisteredUser>(query);

  return result.rows[0] ?? null;
};

const findByEmail = (email: string, client?: PoolClient) => {
  return findByUniqueKey("email", email, client);
};

const findByUsername = (username: string, client?: PoolClient) => {
  return findByUniqueKey("username", username, client);
};

const markEmailAsVerified = async (
  id: string,
  client?: PoolClient,
): Promise<void> => {
  const db = client ?? pool;
  const query = {
    text: `
      UPDATE users
      SET email_verified_at = $1
      WHERE id = $2;
    `,
    values: [new Date(), id],
  };

  await db.query(query);
};

const userRepository = {
  create,
  markEmailAsVerified,
  findByEmail,
  findByUsername,
};

export default userRepository;
