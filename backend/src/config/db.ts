import mysql from "mysql2/promise";
import { env } from "./env";

export const db = mysql.createPool({
  host: env.dbHost,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testDbConnection = async () => {
    // Get a connection from the pool
  const connection = await db.getConnection();

  try {
    // Ping the database to check if the connection is successful
    await connection.ping();
    console.log("MySQL database connected successfully");
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};