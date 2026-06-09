import { ResultSetHeader, RowDataPacket } from "mysql2";
import { CreateCustomCategoryPayload, SelectMasterCategoriesPayload, StoreCategory } from "./category.types";
import { db } from "../../config/db";
import ApiError from "../../utils/ApiError";


type StoreRow = {
  id: number;
} & RowDataPacket;

type MasterCategoryRow = {
  id: number;
  name: string;
  description: string | null;
} & RowDataPacket;

type StoreCategoryRow = StoreCategory & RowDataPacket;

const getStoreByUserId = async(userId : number)=>{
    const [stores] = await db.query<StoreRow[]>(
        `
        SELECT id
        FROM stores
        WHERE user_id = ?
        LIMIT 1
        `,[userId]

    )
    if (stores.length === 0) {
    throw new ApiError(404, "Please create a store first");
  }
  return stores[0];
}

export const storeCategoryService = {
  async getMyStoreCategories(userId: number) {
    const store = await getStoreByUserId(userId);

    const [categories] = await db.query<StoreCategoryRow[]>(
      `
      SELECT
        id,
        store_id,
        master_category_id,
        name,
        description,
        is_custom,
        is_active,
        created_at,
        updated_at
      FROM store_categories
      WHERE store_id = ? AND is_active = TRUE
      ORDER BY name ASC
      `,
      [store.id]
    );

    return categories;
  },

  async selectFromMasterCategories(
    userId: number,
    payload: SelectMasterCategoriesPayload
  ) {
    const store = await getStoreByUserId(userId);

    const { masterCategoryIds } = payload;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [masterCategories] = await connection.query<MasterCategoryRow[]>(
        `
        SELECT id, name, description
        FROM master_categories
        WHERE id IN (?) AND is_active = TRUE
        `,
        [masterCategoryIds]
      );

      if (masterCategories.length !== masterCategoryIds.length) {
        throw new ApiError(400, "Some master categories are invalid");
      }

      for (const category of masterCategories) {
        await connection.query<ResultSetHeader>(
          `
          INSERT IGNORE INTO store_categories
            (store_id, master_category_id, name, description, is_custom)
          VALUES
            (?, ?, ?, ?, FALSE)
          `,
          [store.id, category.id, category.name, category.description]
        );
      }

      await connection.commit();

      const [storeCategories] = await db.query<StoreCategoryRow[]>(
        `
        SELECT
          id,
          store_id,
          master_category_id,
          name,
          description,
          is_custom,
          is_active,
          created_at,
          updated_at
        FROM store_categories
        WHERE store_id = ? AND is_active = TRUE
        ORDER BY name ASC
        `,
        [store.id]
      );

      return storeCategories;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async createCustomCategory(  userId: number,
    payload: CreateCustomCategoryPayload
  ) {
    const store = await getStoreByUserId(userId);

    const [existingCategory] = await db.query<StoreCategoryRow[]>(
      `
      SELECT id
      FROM store_categories
      WHERE store_id = ? AND LOWER(name) = LOWER(?)
      LIMIT 1
      `,
      [store.id, payload.name]
    );

    if (existingCategory.length > 0) {
      throw new ApiError(409, "Category already exists in your store");
    }

    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO store_categories
        (store_id, master_category_id, name, description, is_custom)
      VALUES
        (?, NULL, ?, ?, TRUE)
      `,
      [store.id, payload.name , payload.description ?? null]
    );

    const [createdCategory] = await db.query<StoreCategoryRow[]>(
      `
      SELECT
        id,
        store_id,
        master_category_id,
        name,
        description,
        is_custom,
        is_active,
        created_at,
        updated_at
      FROM store_categories
      WHERE id = ? AND store_id = ?
      `,
      [result.insertId, store.id]
    );

    return createdCategory[0];
  },

  async deactivateStoreCategory(userId: number, categoryId: number) {
    const store = await getStoreByUserId(userId);

    const [category] = await db.query<StoreCategoryRow[]>(
      `
      SELECT id
      FROM store_categories
      WHERE id = ? AND store_id = ?
      LIMIT 1

      `,
      [categoryId, store.id]
    );

    if (category.length === 0) {
      throw new ApiError(404, "Store category not found");
    }

    const [productsUsingCategory] = await db.query<RowDataPacket[]>(
      `
      SELECT id
      FROM products
      
      WHERE store_category_id = ? AND store_id = ? AND is_active = TRUE
      LIMIT 1
      `,
      [categoryId, store.id]
    );

    if (productsUsingCategory.length > 0) {
      throw new ApiError(
        400,
        "Cannot deactivate category because active products are using it"
      );
    }

    await db.query<ResultSetHeader>(
      `
      UPDATE store_categories
      SET is_active = FALSE
      WHERE id = ? AND store_id = ?
      `,
      [categoryId, store.id]
    );

    return true;
  },
};