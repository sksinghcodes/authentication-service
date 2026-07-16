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

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET environment variable is missing.");
}

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET environment variable is missing.");
}

if (!process.env.ALLOWED_CLIENTS) {
  throw new Error("ALLOWED_CLIENTS environment variable is missing.");
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

// jwt config
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_EXPIRES_IN_DAYS = Number(
  process.env.JWT_REFRESH_EXPIRES_IN_DAYS ?? 7,
);
export const JWT_ACCESS_EXPIRES_IN_MINUTES = Number(
  process.env.JWT_ACCESS_EXPIRES_IN_MINUTES ?? 15,
);

// clients config
export const ALLOWED_CLIENTS = process.env.ALLOWED_CLIENTS.split(",").map(
  (origin) => origin.trim(),
);
