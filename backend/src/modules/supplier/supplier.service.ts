import { ResultSetHeader, RowDataPacket } from "mysql2";
import { CreateSupplierPayload, Supplier, UpdateSupplierPayload } from "./supplier.types";
import { db } from "../../config/db";
import ApiError from "../../utils/ApiError";

type StoreRow = {
  id: number;
} & RowDataPacket;

type SupplierRow = Supplier & RowDataPacket;

const getStoreByUserId = async(user_id: number): Promise<StoreRow>=>{
    const [store] = await db.query<StoreRow[]>(
        `
        SELECT
        id
        FROM stores
        WHERE user_id = ?
        LIMIT 1
        `,
        [user_id]
    )
    if (store.length===0) {
        throw new ApiError(404 , "s.s store not found")
    }

    return store[0];;
}

//suupplier service object
export const supplierService = {
    //create supplier service

    async createSupplier(userId : number , payload : CreateSupplierPayload){
     const store = await getStoreByUserId(userId);
     
     const [result] = await db.query<ResultSetHeader>(
        `
        INSERT INTO suppliers
        (store_id, name, phone, email, address)
        VALUES
        (?, ?, ?, ?, ?)
        `,
        [
            store.id,
            payload.name,
            payload.phone ?? null,
            payload.email ?? null,
            payload.address ?? null
        ]
     );

     const [supplier] = await db.query<SupplierRow[]>(
        `
        SELECT 
        id , store_id, name, phone, email, address, is_active, created_at, updated_at
        FROM suppliers
        WHERE id = ? AND store_id=?
        `,
        [result.insertId , store.id]
     );
     if (supplier.length===0) {
        throw new ApiError(404, "Supplier couldn't be fetched")
     }
     return supplier[0];

    },

   async getMySuppliers(userId: number): Promise<SupplierRow[]> {
    const store = await getStoreByUserId(userId);
    
    const [suppliers] = await db.query<SupplierRow[]>(
        `
        SELECT
        id, store_id, name, phone, email, address, is_active, created_at, updated_at
        FROM suppliers
        WHERE store_id = ? AND is_active = true 
        ORDER BY created_at DESC
        `,
        [store.id]
    )

    return suppliers;
    },

    async getSupplierById(userId: number, supplierId : number) : Promise<SupplierRow>{
        const store = await getStoreByUserId(userId);

        const [supplier] = await db.query<SupplierRow[]>(
            `
            SELECT 
            id, store_id, name, phone, email, address, is_active, created_at, updated_at
            FROM suppliers
            WHERE id = ?
            AND store_id = ?
            AND is_active = true
            LIMIT 1
            `,
            [supplierId, store.id]
        ) ;

        if (supplier.length === 0) {
        throw new ApiError(404, "Supplier not found");
        };

        return supplier[0];

    },
    async updateSupplier(userId: number,supplierId: number,
    payload: UpdateSupplierPayload
  ): Promise<SupplierRow>{
     const store = await getStoreByUserId(userId);

        const [existingSupplier] = await db.query<SupplierRow[]>( 
            `
            SELECT id
            FROM suppliers
            WHERE id = ?
            AND store_id = ?
            AND is_active = true
            LIMIT 1
            `,
            [supplierId , store.id]
        );
        if (existingSupplier.length === 0) {
          throw new ApiError(404, "Supplier not found");
        }
        const [result] = await db.query<ResultSetHeader>(
            `
            UPDATE suppliers
            SET
            name = COALESCE(?, name),
            phone = COALESCE(?, phone),
            email = COALESCE(?, email),
            address = COALESCE(?, address)
            WHERE id = ? AND store_id = ?
            `,
            [
                payload.name ?? null,
                payload.phone ?? null,
                payload.email ?? null,
                payload.address ?? null,
                supplierId,
                store.id,
            ]
        )

        const [updatedSupplier] = await db.query<SupplierRow[]>(
            `
            select *
            FROM suppliers
            WHERE id = ? AND store_id = ?
            `,
            [supplierId , store.id]
        )
          return updatedSupplier[0];
  },


  //deactivate supplier
  async deactivateSupplier(userId: number, supplierId: number) {
  const store = await getStoreByUserId(userId);

  const [supplier] = await db.query<SupplierRow[]>(
    `
    SELECT id
    FROM suppliers
    WHERE id = ? AND store_id = ? AND is_active = TRUE
    LIMIT 1
    `,
    [supplierId, store.id]
  );

  if (supplier.length === 0) {
    throw new ApiError(404, "Supplier not found");
  }

  const [productsUsingSupplier] = await db.query<RowDataPacket[]>(
    `
    SELECT id
    FROM products
    WHERE supplier_id = ? AND store_id = ? AND is_active = TRUE
    LIMIT 1
    `,
    [supplierId, store.id]
  );

  if (productsUsingSupplier.length > 0) {
    throw new ApiError(
      400,
      "Cannot deactivate supplier because active products are using it"
    );
  }

  await db.query<ResultSetHeader>(
    `
    UPDATE suppliers
    SET is_active = FALSE
    WHERE id = ? AND store_id = ?
    `,
    [supplierId, store.id]
  );

  return true;
},



};