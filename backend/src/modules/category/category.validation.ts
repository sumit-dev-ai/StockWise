import { z } from "zod";

export const selectMasterCategoriesSchema = z.object({
  masterCategoryIds: z
    .array(z.number().int().positive())
    .min(1, "Select at least one category"),
});

export const createCustomCategorySchema = z.object({
    name : z.string().trim().min(2," at least two letters are needed for category name")
    .max(100, "Max letters required for category name are 100"),

    description: z.string().trim().max(500).optional(),
})