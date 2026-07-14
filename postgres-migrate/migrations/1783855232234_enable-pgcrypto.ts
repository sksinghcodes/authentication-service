import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async (pgm: MigrationBuilder): Promise<void> => {
  pgm.createExtension("pgcrypto", {
    ifNotExists: true,
  });
};

export const down = async (pgm: MigrationBuilder): Promise<void> => {
  pgm.dropExtension("pgcrypto", {
    ifExists: true,
  });
};
