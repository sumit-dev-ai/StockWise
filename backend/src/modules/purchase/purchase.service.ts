import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";
import ApiError from "../../utils/ApiError";
import { validate } from "../../middlewares/validate.middleware";
import { CreatePurchasePayload } from "./purchase.type";


type StoreRow = {
  id: number;
} & RowDataPacket;

type ProductStockRow = {
  id: number;
  store_id: number;
  supplier_id: number;
  stock_quantity: number;
  name: string;
} & RowDataPacket;

const getStoreByUserId = async (userId: number) : Promise<StoreRow>=>{
    const [rows] = await db.query<StoreRow[]>(
        `
        SELECT id
        FROM stores
        WHERE user_id = ?
        LIMIT 1
        `,
        [userId]
    );

    if (rows.length===0) {
        throw new ApiError(404 , "store not found")
    }

    return rows[0];
}

const getProductForPurchase = async (
    store_id : number,
    product_id : number,
): Promise<ProductStockRow>=>{
     const [rows] = await db.query<ProductStockRow[]>(
    `
    SELECT
      id,
      store_id,
      supplier_id,
      stock_quantity,
      name
    FROM products
    WHERE id = ?
      AND store_id = ?
      AND is_active = TRUE
    LIMIT 1
    `,
    [product_id, store_id]
  );

  if (rows.length === 0 ) {
    throw new ApiError(404, "product not found or inactive")
  }
  return rows[0];
}

const validateSupplier = async (
    supplier_id: number,
    store_id: number
) : Promise<void>=>{
    const [rows] = await db.query<RowDataPacket[]>(
        `
        SELECT 
        id
        FROM
        suppliers
        WHERE store_id = ?
        AND is_active = true
        LIMIT 1
        `,[supplier_id, store_id]
    );

    if (rows.length ===0) {
        throw new ApiError(404 , "supplier not found or is inactive")
    }
}

export const createPurchaseService = async (
    user_id : number,
    payload : CreatePurchasePayload
)=>{
    //for store id
    const store = await getStoreByUserId(user_id);

    const product = await getProductForPurchase(store.id , payload.product_id);

    await validateSupplier(store.id , payload.supplier_id);

    const quantity = payload.quantity;
    const unitCost = payload.unit_cost;
    const totalCost = quantity * Number(unitCost);

    const previousStock = product.stock_quantity;
    const newStock = previousStock + quantity;
    const purchaseDate = payload.purchase_date || new Date().toISOString().slice(0,10);

    //transaction
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [purchaseResult] = await connection.query<ResultSetHeader>(
            `
            INSERT INTO stock_purchases (
            store_id,
            product_id,
            supplier_id,
            quantity,
            unit_cost,
            total_cost,
            purchase_date,
            notes            
            )
            VALUES
            ( ?, ?,?, ?,?, ?,?, ?)
            `,
            [
                store.id,
                payload.product_id,
                payload.supplier_id,
                quantity,
                unitCost,
                totalCost,
                purchaseDate,
                payload.notes || null,
            ]
        );

        const purchaseId = purchaseResult.insertId;
        //product stock
        await connection.query(
            `
            UPDATE products
            SET stock_quantity = ?
            WHERE id = ?
            AND store_id = ?
            `,
            [newStock, payload.product_id, store.id]
        );

        await connection.query(
            `
            INSERT INTO inventory_logs (
            store_id,
            product_id,
            change_type,
            quantity_change,
            previous_stock,
            new_stock,
            reference_type,
            reference_id,
            note            
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )
            `,
            [
                store.id,
                payload.product_id,
                "PURCHASE",
                quantity,
                previousStock,
                newStock,
                "PURCHASE",
                purchaseId,
                payload.notes || `Stock purchased : %{quantity} units`,

            ]
        );

    await connection.commit();

    const [purchaseRows] = await db.query<RowDataPacket[]>(
        `
        SELECT
            sp.id,
            sp.store_id,
            sp.product_id,
            sp.supplier_id,
            sp.quantity,
            sp.unit_cost,
            sp.total_cost,
            sp.purchase_date,
            sp.notes,
            sp.created_at,
            sp.updated_at,
            p.name AS product_name,
            p.sku AS product_sku,
            s.name AS supplier_name
            FROM stock_purchases sp
            LEFT JOIN products p
                ON sp.product_id = p.id
            LEFT JOIN suppliers s
                ON sp.supplier_id = s.id
            WHERE sp.id = ?
            LIMIT 1

        `,
        [purchaseId]

    );
    return purchaseRows[0];

    } catch (error) {
        await connection.rollback();
        throw error;
    }finally{
        connection.release();
    }

    
}

export const getPurchasesService = async (user_id: number) => {
  const store = await getStoreByUserId(user_id);

  const [purchases] = await db.query<RowDataPacket[]>(
    `
    SELECT
      sp.id,
      sp.store_id,
      sp.product_id,
      sp.supplier_id,
      sp.quantity,
      sp.unit_cost,
      sp.total_cost,
      sp.purchase_date,
      sp.notes,
      sp.created_at,
      sp.updated_at,
      p.name AS product_name,
      p.sku AS product_sku,
      s.name AS supplier_name
    FROM stock_purchases sp
    LEFT JOIN products p
      ON sp.product_id = p.id
    LEFT JOIN suppliers s
      ON sp.supplier_id = s.id
    WHERE sp.store_id = ?
    ORDER BY sp.purchase_date DESC, sp.created_at DESC
    `,
    [store.id]
  );

  return purchases;
};

export const getPurchaseByIdService = async (
  user_id: number,
  purchase_id: number
) => {
  const store = await getStoreByUserId(user_id);

  const [purchases] = await db.query<RowDataPacket[]>(
    `
    SELECT
      sp.id,
      sp.store_id,
      sp.product_id,
      sp.supplier_id,
      sp.quantity,
      sp.unit_cost,
      sp.total_cost,
      sp.purchase_date,
      sp.notes,
      sp.created_at,
      sp.updated_at,
      p.name AS product_name,
      p.sku AS product_sku,
      s.name AS supplier_name
    FROM stock_purchases sp
    LEFT JOIN products p
      ON sp.product_id = p.id
    LEFT JOIN suppliers s
      ON sp.supplier_id = s.id
    WHERE sp.id = ?
      AND sp.store_id = ?
    LIMIT 1
    `,
    [purchase_id, store.id]
  );

  if (purchases.length === 0) {
    throw new ApiError(404, "Purchase not found.");
  }

  return purchases[0];
};