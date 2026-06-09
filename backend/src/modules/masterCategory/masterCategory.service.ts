import { RowDataPacket } from "mysql2";
import { MasterCategory } from "./masterCategory.types";
import { db } from "../../config/db";

type MasterCategoryRow = MasterCategory & RowDataPacket;

export const getAllMasterCategories=async()=>{
    try {
        const [rows] = await db.query<MasterCategoryRow[]>(`
        SELECT 
        id,
        name,
        description,
        icon,
        is_active,
        created_at,
        updated_at
        FROM master_categories
        WHERE is_active = TRUE
        ORDER BY name ASC
        `)

        return rows;
    } catch (error) {
        console.log(error)
    }

}