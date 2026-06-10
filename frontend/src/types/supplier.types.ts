export type Supplier = {
  id: number;
  store_id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateSupplierPayload = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;