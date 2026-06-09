export type MasterCategory = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};