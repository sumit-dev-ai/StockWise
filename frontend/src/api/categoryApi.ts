import type { CreateCustomCategoryPayload, SelectMasterCategoriesPayload } from "../types/category.types";
import { api } from "./authApi";

export const storeCategoryApi = {
  getMyCategories: () => api.get("/store-categories"),

  selectFromMaster: (data: SelectMasterCategoriesPayload) =>
    api.post("/store-categories/select", data),

  createCustom: (data : CreateCustomCategoryPayload) =>
    api.post("/store-categories", data),

  deactivate: (id:number) =>
    api.patch(`/store-categories/${id}/deactivate`),
};