export type Store = {
  id: number;
  user_id: number;
  name: string;
  location: string | null;
  business_type: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
};


export type CreateStorePayload= {
  name: string;
  location?: string;
  business_type?: string;
  currency?: string;
};

export type UpdateStorePayload = Partial<CreateStorePayload>;