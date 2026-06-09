export type MasterCategory = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type StoreCategory = {
  id: number;
  store_id: number;
  master_category_id: number | null;
  name: string;
  description: string | null;
  is_custom: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SelectMasterCategoriesPayload = {
  masterCategoryIds: number[];
};

export type CreateCustomCategoryPayload = {
  name: string;
  description?: string;
  is_custom?: true;
};