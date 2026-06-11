import { RowDataPacket } from "mysql2";

export type Product = {
    id: number;
    store_id : number;
    store_category_id : number;
    supplier_id : number;
    name : string ;
    sku : string;
    description : string | null;
    cost_price : number;
    selling_price : number;
    stock_quantity : number;
    low_stock_threshold : number;
    unit : string | 'pcs';
    is_active : boolean
    created_at : Date;
    updated_at : Date;

}
export type ProductRow = Product & RowDataPacket;

export type CreateProductPayload = {
  store_category_id: number;
  supplier_id: number;
  name: string;
  sku: string;
  description?: string;
  cost_price: number;
  selling_price: number;
  stock_quantity?: number;
  low_stock_threshold?: number;
  unit?: string;
};

export type UpdateProductPayload = {
  store_category_id?: number;
  supplier_id?: number;
  name?: string;
  sku?: string;
  description?: string;
  cost_price?: number;
  selling_price?: number;
  stock_quantity?: number;
  low_stock_threshold?: number;
  unit?: string;
  is_active?: boolean;
};

//query params for filtering
export type ProductFilters = {
  search?: string;
  store_category_id?: number;
  supplier_id?: number;
  is_active?: boolean;
};