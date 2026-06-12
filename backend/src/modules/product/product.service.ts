import { ResultSetHeader, RowDataPacket } from "mysql2";
import ApiError from "../../utils/ApiError";
import { db } from "../../config/db";
import { CreateProductPayload, ProductFilters, ProductRow, UpdateProductPayload } from "./product.type";

type StoreRow = {
  id: number;
} & RowDataPacket;

type CountRow = {
  count: number;
} & RowDataPacket;

 const getStoreByUserId = async (user_id: number): Promise<StoreRow> => {
  const [rows] = await db.query<StoreRow[]>(
    `
    SELECT id FROM stores
    WHERE user_id = ?
    LIMIT 1
    `,
    [user_id]
  );

  if (rows.length === 0) {
    throw new ApiError(404, "Store not found. create your store first.");
  }

  return rows[0];
};
 const validateStoreCategory = async (
  store_id: number,
  store_category_id: number
): Promise<void> => {
  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT id
    FROM store_categories
    WHERE id = ? AND store_id = ?
      AND is_active = TRUE
    LIMIT 1
    `,
    [store_category_id, store_id]
  );

  if (rows.length === 0) {
    throw new ApiError(400, "Invalid category for this store.");
  }
};

 const validateSupplier = async (
  store_id: number,
  supplier_id: number
): Promise<void> => {
    const [rows] = await db.query<RowDataPacket[]>(
        `
        SELECT id FROM suppliers
        WHERE id = ?
        AND store_id = ?
        AND is_active = ? 
        `,
        [supplier_id , store_id,true]
    )
      if (rows.length === 0) {
    throw new ApiError(400, "Invalid supplier for this store.");
  }
}

const checkSkuExists = async(
  store_id : number, sku: string,
  excludeProductId?: number
): Promise<void>=>{
  //query fir checking uniqueness
  let query = `
  SELECT id
  FROM products
  where store_id =?
  AND sku =?
  `;
  //params required for query
  const params : Array <string | number> =[store_id, sku];

  if (excludeProductId) {
    //note for myself : if product id is given for editing product details then we check if sku is available in another table or not
    // to do that we have to check with other ids except the one we are working on so id!=?
    query += `AND id!=?`;
    //pushing id into params
    params.push(excludeProductId);
  }

    query += ` LIMIT 1`;
  //running the db query
  const [rows] = await db.query<RowDataPacket[]>(query,params);

  //check for duplicate
  if (rows.length> 0 ) {
    throw new ApiError(409, "SKU already exists")
  }
}


export const createProductService = async (
  user_id: number,
  payload: CreateProductPayload
): Promise<ProductRow>=>{
  const store = await getStoreByUserId(user_id);

  await validateStoreCategory(store.id, payload.store_category_id);
  await validateSupplier(store.id, payload.supplier_id);
  await checkSkuExists(store.id, payload.sku);

  const [result] = await db.query<ResultSetHeader>(
    `
    INSERT INTO products
    (
    store_id, store_category_id, supplier_id, 
    name, sku, description,
    cost_price, selling_price,
    stock_quantity, low_stock_threshold, unit 
      ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      store.id,
      payload.store_category_id,
      payload.supplier_id,
      payload.name,
      payload.sku,
      payload.description || null,
      payload.cost_price,
      payload.selling_price,
      payload.stock_quantity ?? 0,
      payload.low_stock_threshold ?? 10,
      payload.unit || "pcs",
    ]
  );
    const [products] = await db.query<ProductRow[]>(
        `
        SELECT *
        FROM products
        WHERE id = ?
        LIMIT 1
        `,
      [result.insertId]
    );

    return products[0];
}

//getProduct service

export const getProductService = async (
  user_id : number,
  filters: ProductFilters
)=>{
  const store = await getStoreByUserId(user_id);

  let query = `
    SELECT
    p.id,
    p.store_id,
    p.store_category_id,
    p.supplier_id,
    p.name,
    p.sku,
    p.description,
    p.cost_price,
    p.selling_price,
    p.stock_quantity,
    p.low_stock_threshold,
    p.unit,
    p.is_active,
    p.created_at,
    p.updated_at,

    sc.name AS category_name,
    s.name AS supplier_name

    FROM products p
    LEFT JOIN store_categories sc
    ON p.store_category_id = sc.id
    LEFT JOIN suppliers s
    ON p.supplier_id = s.id
    WHERE p.store_id = ?

  `;
    const params: Array<string | number | boolean> = [store.id];

  if (filters.search) {
    query += `
      AND (
        p.name LIKE ?
        OR p.sku LIKE ?
      )
    `;
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.store_category_id) {
    query += ` AND p.store_category_id = ?`;
    params.push(filters.store_category_id);
  }

  if (filters.supplier_id) {
    query += ` AND p.supplier_id = ?`;
    params.push(filters.supplier_id);
  }

  if (typeof filters.is_active === "boolean") {
    query += ` AND p.is_active = ?`;
    params.push(filters.is_active);
  }

  query += ` ORDER BY p.created_at DESC`;

  const [products] = await db.query<RowDataPacket[]>(query, params);

  return products;

}

export const getProductByIdService = async (
  user_id: number,
  product_id: number
) => {
  const store = await getStoreByUserId(user_id);

  const [products] = await db.query<RowDataPacket[]>(
    `
    SELECT
      p.id,
      p.store_id,
      p.store_category_id,
      p.supplier_id,
      p.name,
      p.sku,
      p.description,
      p.cost_price,
      p.selling_price,
      p.stock_quantity,
      p.low_stock_threshold,
      p.unit,
      p.is_active,
      p.created_at,
      p.updated_at,
      sc.name AS category_name,
      s.name AS supplier_name
    FROM products p
    LEFT JOIN store_categories sc
      ON p.store_category_id = sc.id
    LEFT JOIN suppliers s
      ON p.supplier_id = s.id
    WHERE p.id = ?
      AND p.store_id = ?
    LIMIT 1
    `,
    [product_id, store.id]
  );

  if (products.length === 0) {
    throw new ApiError(404, "Product not found.");
  }

  return products[0];
};

export const updateProductService = async (
  user_id: number,
  product_id: number,
  payload: UpdateProductPayload
) => {
  const store = await getStoreByUserId(user_id);

  const [existingProducts] = await db.query<ProductRow[]>(
    `
    SELECT *
    FROM products
    WHERE id = ?
      AND store_id = ?
    LIMIT 1
    `,
    [product_id, store.id]
  );

  if (existingProducts.length === 0) {
    throw new ApiError(404, "Product not found.");
  }

  if (payload.store_category_id) {
    await validateStoreCategory(store.id, payload.store_category_id);
  }

  if (payload.supplier_id) {
    await validateSupplier(store.id, payload.supplier_id);
  }

  if (payload.sku) {
    await checkSkuExists(store.id, payload.sku, product_id);
  }

  await db.query(
    `
    UPDATE products
    SET
      store_category_id = COALESCE(?, store_category_id),
      supplier_id = COALESCE(?, supplier_id),
      name = COALESCE(?, name),
      sku = COALESCE(?, sku),
      description = COALESCE(?, description),
      cost_price = COALESCE(?, cost_price),
      selling_price = COALESCE(?, selling_price),
      stock_quantity = COALESCE(?, stock_quantity),
      low_stock_threshold = COALESCE(?, low_stock_threshold),
      unit = COALESCE(?, unit),
      is_active = COALESCE(?, is_active)
    WHERE id = ?
      AND store_id = ?
    `,
    [
      payload.store_category_id ?? null,
      payload.supplier_id ?? null,
      payload.name ?? null,
      payload.sku ?? null,
      payload.description ?? null,
      payload.cost_price ?? null,
      payload.selling_price ?? null,
      payload.stock_quantity ?? null,
      payload.low_stock_threshold ?? null,
      payload.unit ?? null,
      typeof payload.is_active === "boolean" ? payload.is_active : null,
      product_id,
      store.id,
    ]
  );

  return getProductByIdService(user_id, product_id);
};

export const deactivateProductService = async (
  user_id: number,
  product_id: number
) => {
  const store = await getStoreByUserId(user_id);

  const [result] = await db.query<ResultSetHeader>(
    `
    UPDATE products
    SET is_active = FALSE
    WHERE id = ?
      AND store_id = ?
    `,
    [product_id, store.id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Product not found.");
  }

  return {
    id: product_id,
    is_active: false,
  };
};


export const getLowStockProductsService = async (user_id: number) => {
  const store = await getStoreByUserId(user_id);

  const [products] = await db.query<RowDataPacket[]>(
    `
    SELECT
      p.id,
      p.name,
      p.sku,
      p.stock_quantity,
      p.low_stock_threshold,
      p.unit,
      sc.name AS category_name,
      s.name AS supplier_name
    FROM products p
    LEFT JOIN store_categories sc
      ON p.store_category_id = sc.id
    LEFT JOIN suppliers s
      ON p.supplier_id = s.id
    WHERE p.store_id = ?
      AND p.is_active = TRUE
      AND p.stock_quantity <= p.low_stock_threshold
    ORDER BY p.stock_quantity ASC
    `,
    [store.id]
  );

  return products;
};