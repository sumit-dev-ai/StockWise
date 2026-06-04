import { RowDataPacket } from "mysql2";

//data we get from database
export type UserRow = RowDataPacket & {
  id: number;
  google_id: string;
  full_name: string;
  email: string;
  avatar_url : string | null;
  created_at: Date;
  updated_at: Date;
};

// data needed to create a user
export type CreateGoogleUserInput = {
  googleId: string;
  fullName: string;
  email: string;
  profilePicture: string | null;
};