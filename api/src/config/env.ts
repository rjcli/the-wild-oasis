import dotenv from "dotenv";
dotenv.config();

const required = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number.parseInt(process.env.PORT ?? "3000", 10),

  DATABASE_URL: required("DATABASE_URL"),

  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "1d",

  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",

  CORS_ORIGINS: (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim()),

  MAX_FILE_SIZE_BYTES:
    Number.parseInt(process.env.MAX_FILE_SIZE_MB ?? "5", 10) * 1024 * 1024,
  UPLOADS_DIR: process.env.UPLOADS_DIR ?? "public/uploads",
} as const;

export const isDev = env.NODE_ENV === "development";
