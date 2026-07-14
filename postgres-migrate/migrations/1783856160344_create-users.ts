import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async (pgm: MigrationBuilder): Promise<void> => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    first_name: {
      type: "text",
    },
    last_name: {
      type: "text",
    },
    email: {
      type: "text",
      notNull: true,
      unique: true,
    },
    email_verified_at: {
      type: "timestamp",
    },
    username: {
      type: "text",
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });
};

export const down = async (pgm: MigrationBuilder): Promise<void> => {
  pgm.dropTable("users");
};
