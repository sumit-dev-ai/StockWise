import { RowDataPacket } from "mysql2";

export type StockPurchase = {
    id: number;
    store_id : number;
    product_id: number;
   supplier_id: number;
   quantity: number;
   unit_cost: number | string;
   total_cost: number | string;
   purchase_date: string;
   notes: string | null;
   created_at: Date;
   updated_at: Date;
};

export type StockPurchaseRow = StockPurchase & RowDataPacket;

export type CreatePurchasePayload = {
    product_id: number;
    supplier_id: number;
    quantity: number;
    unit_cost: number | string;
    purchase_date?: string;
    notes?: string | null;
};
