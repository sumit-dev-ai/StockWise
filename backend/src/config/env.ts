import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "PORT",
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "GOOGLE_CLIENT_ID",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "FRONTEND_URL",
  "NODE_ENV",
] as const; // readonly array

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 8001, 

  dbHost: process.env.DB_HOST as string,
  dbPort: Number(process.env.DB_PORT),
  dbUser: process.env.DB_USER as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,

  googleClientId: process.env.GOOGLE_CLIENT_ID as string,

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,

  frontendUrl: process.env.FRONTEND_URL as string,
  nodeEnv: process.env.NODE_ENV as string,
};