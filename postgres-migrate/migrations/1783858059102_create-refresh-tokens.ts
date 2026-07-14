import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async (pgm: MigrationBuilder): Promise<void> => {
  pgm.createTable("refresh_tokens", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    token_hash: {
      type: "text",
      notNull: true,
      unique: true,
    },
    device_info: {
      type: "text",
    },
    user_agent: {
      type: "text",
    },
    ip_address: {
      type: "text",
    },
    expires_at: {
      type: "timestamp",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    revoked_at: {
      type: "timestamp",
    },
  });

  pgm.createIndex("refresh_tokens", "user_id");
  pgm.createIndex("refresh_tokens", "expires_at");
};

export const down = async (pgm: MigrationBuilder): Promise<void> => {
  pgm.dropTable("refresh_tokens");
};
