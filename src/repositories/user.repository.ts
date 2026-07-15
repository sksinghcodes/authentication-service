import type { PoolClient } from "pg";
import pool from "../config/database.js";
import type {
  UserCreateRepoInput,
  UserCreateRepoOutput,
  UserFindRepoOutputPrivate,
} from "../types/user.type.js";

const create = async (
  user: UserCreateRepoInput,
  client?: PoolClient,
): Promise<UserCreateRepoOutput> => {
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

  const result = await db.query<UserCreateRepoOutput>(query);
  return result.rows[0];
};

const findByCondition = async ({
  condition,
  values,
  client,
}: {
  condition: string;
  values: string[];
  client?: PoolClient;
}): Promise<UserFindRepoOutputPrivate | null> => {
  const db = client ?? pool;

  const query = {
    text: `
      SELECT
        id,
        first_name,
        last_name,
        username,
        email,
        email_verified_at,
        password_hash
      FROM users
      WHERE ${condition}
      LIMIT 1;
    `,
    values,
  };

  const result = await db.query<UserFindRepoOutputPrivate>(query);
  return result.rows[0] ?? null;
};

const findOne = async (
  field: "email" | "username",
  value: string,
  client?: PoolClient,
): Promise<UserFindRepoOutputPrivate | null> => {
  return findByCondition({
    condition: `${field} = $1`,
    values: [value],
    client,
  });
};

const findByEmail = (email: string, client?: PoolClient) => {
  return findOne("email", email, client);
};

const findByUsername = (username: string, client?: PoolClient) => {
  return findOne("username", username, client);
};

const findByUsernameOrEmail = (
  usernameOrEmail: string,
  client?: PoolClient,
) => {
  return findByCondition({
    condition: "email = $1 OR username = $1",
    values: [usernameOrEmail],
    client,
  });
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
  findByEmail,
  findByUsername,
  markEmailAsVerified,
  findByUsernameOrEmail,
};

export default userRepository;
