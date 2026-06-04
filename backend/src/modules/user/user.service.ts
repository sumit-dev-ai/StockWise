import { ResultSetHeader } from "mysql2";
import { db } from "../../config/db";
import type { CreateGoogleUserInput, UserRow } from "./user.types";

export const findUserByGoogleId = async (googleId: string) => {
  const [rows] = await db.query<UserRow[]>(
    `
    SELECT
      id,
      google_id,
      full_name,
      email,
      avatar_url,
      created_at,
      updated_at
    FROM users
    WHERE google_id = ?
    LIMIT 1
    `,
    [googleId]
  );

  return rows[0] || null;
};

export const findUserById = async (userId: number) => {
  const [rows] = await db.query<UserRow[]>(
    `
    SELECT
      id,
      google_id,
      full_name,
      email,
      avatar_url,
      created_at,
      updated_at
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
};

export const createGoogleUser = async (data: CreateGoogleUserInput) => {
  const [result] = await db.query<ResultSetHeader>(
    `
    INSERT INTO users
      (google_id, full_name, email, avatar_url)
    VALUES
      (?, ?, ?, ?)
    `,
    [data.googleId, data.fullName, data.email, data.profilePicture]
  );

  return await findUserById(result.insertId);
};