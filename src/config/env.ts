if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

if (!process.env.SMTP_HOST) {
  throw new Error("SMTP_HOST environment variable is missing.");
}

if (!process.env.SMTP_PORT) {
  throw new Error("SMTP_PORT environment variable is missing.");
}

if (!process.env.SMTP_USER) {
  throw new Error("SMTP_USER environment variable is missing.");
}

if (!process.env.SMTP_PASSWORD) {
  throw new Error("SMTP_PASSWORD environment variable is missing.");
}

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL environment variable is missing.");
}

export const PORT = Number(process.env.PORT ?? 4000);

// security config
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? 12);

// database config
export const DATABASE_URL = process.env.DATABASE_URL;

// frontend config
export const FRONTEND_URL = process.env.FRONTEND_URL;

// email confif
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = Number(process.env.SMTP_PORT);
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
