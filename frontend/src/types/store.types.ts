export type CreateStorePayload= {
  name: string;
  location?: string;
  business_type?: string;
  currency?: string;
};

export type UpdateStorePayload = Partial<CreateStorePayload>;