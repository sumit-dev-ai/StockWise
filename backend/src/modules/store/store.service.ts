import { db } from "../../config/db"
import ApiError from "../../utils/ApiError";
import { CreateStoreInput, Store, UpdateStoreInput } from "./store.types"

export const findStoreByUserId=async(userId: number)=>{
    const [rows]:any = await db.query(`
        SELECT
        id,
        user_id,
        name,
        location,
        business_type,
        currency,
        created_at,
        updated_at 
        FROM stores
        WHERE user_id = ?`
        , [userId]);
        
    return rows[0] || null;
};

export const createStoreService = async(userId : number , data : CreateStoreInput)=>{
    const existingStore = await findStoreByUserId(userId);

    if (existingStore) {
        throw new ApiError(409, "User already has a store registered with this id")
    }

    const [result] : any = await db.query(
        `
        INSERT INTO stores
        (user_id, name, location, business_type, currency)
        VALUES( ?,  ?,?, ?, ?)
        `,[
            userId, data.name ,
            data.location || null,
            data.business_type || null,
            data.currency || "INR",
        ]
    )

    const createdStoreId = result.insertId;
    const [rows]: any = await db.query(
    `SELECT 
    id,
    user_id,
    name,
    location,
    business_type,
    currency,
    created_at,
    updated_at
    FROM stores
    WHERE id = ?`, [createdStoreId]
    );

  return rows[0];
} 

export const updateStoreService = async (
  userId: number,
  data: UpdateStoreInput
) => {
  const existingStore = await findStoreByUserId(userId);

  if (!existingStore) {
    throw new ApiError(404, "Store not found");
  }

  await db.query(
    `UPDATE stores
    SET 
    name = COALESCE(?, name),
    location = COALESCE(?, location),
    business_type = COALESCE(?, business_type),
    currency = COALESCE(?, currency)
    WHERE user_id = ?`,
    [
      data.name ?? null,
      data.location ?? null,
      data.business_type ?? null,
      data.currency ?? null,
      userId,
    ]
  );

  return await findStoreByUserId(userId);
};