export type CreateStoreInput = {
  name: string;
  location?: string;
  business_type?: string;
  currency?: string;
};

export type UpdateStoreInput = Partial<CreateStoreInput>;

export type Store = {
  id: number;
  user_id: number;
  name: string;
  location: string | null;
  business_type: string | null;
  currency: string;
  created_at: Date;
  updated_at: Date;
};