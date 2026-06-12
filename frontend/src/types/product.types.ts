export type Product = {
    id : number;
    store_id : number;
    supplier_id: number;
    store_category_id: number;
    name: string;
    sku: string;
    description: string | null;
    cost_price: number | string;
    selling_price: number | string;
    stock_quantity: number;
    low_stock_threshold: number;
    unit: string;
    is_active: boolean ;
    created_at: string;
    updated_at: string;
    category_name?: string;
    supplier_name?: string;
};

export type CreateProductPayload = {
  store_category_id: number;
  supplier_id: number;
  name: string;
  sku: string;
  description?: string;
  cost_price: number | string;
  selling_price: number | string;
  stock_quantity?: number;
  low_stock_threshold?: number;
  unit?: string;
};

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  is_active?: boolean;
};

export type ProductFilters = {
  search?: string;
  store_category_id?: string;
  supplier_id?: string;
  is_active?: string;
};