export type StoreCategory = {
  id: number;
  store_id: number;
  master_category_id: number | null;
  name: string;
  description: string | null;
  is_custom: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type CreateCustomCategoryPayload = {
  name: string;
  description?: string;
};

export type SelectMasterCategoriesPayload = {
  masterCategoryIds: number[];
};