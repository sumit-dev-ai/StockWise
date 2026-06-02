import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
    "PORT", 
    "DB_HOST",
    "DB_PORT",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "JWT_SECRET",
] as const;         //readony array

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}

export const env = {
  port: process.env.PORT || "8000",
  dbHost: process.env.DB_HOST as string,
  dbUser: process.env.DB_USER as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
  jwtSecret: process.env.JWT_SECRET as string,
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  nodeEnv: process.env.NODE_ENV || "development",
};