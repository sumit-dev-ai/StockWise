import { z } from "zod";

export const createProductSchema = z.object({
    store_category_id: z.coerce.number().int().positive(),
    supplier_id: z.coerce.number().int().positive(),
    name: z.string().trim().min(2, "Product name must be at least 2 characters"),
    sku: z.string().trim().min(2, "SKU must be at least 2 characters"),
    description: z.string().trim().optional(),

    cost_price: z.coerce.number().min(0, "Cost price cannot be negative"),
    selling_price: z.coerce.number().min(0, "Selling price cannot be negative"),

    stock_quantity: z.coerce.number().int().min(0).optional().default(0),
    low_stock_threshold: z.coerce.number().int().min(0).optional().default(10),

    unit: z.string().trim().optional().default("pcs"),


})

export const updateProductSchema = z.object({
  store_category_id: z.coerce.number().int().positive().optional(),
  supplier_id: z.coerce.number().int().positive().optional(),

  name: z.string().trim().min(2).optional(),
  sku: z.string().trim().min(2).optional(),

  description: z.string().trim().optional(),

  cost_price: z.coerce.number().min(0).optional(),
  selling_price: z.coerce.number().min(0).optional(),

  stock_quantity: z.coerce.number().int().min(0).optional(),
  low_stock_threshold: z.coerce.number().int().min(0).optional(),

  unit: z.string().trim().optional(),
  is_active: z.boolean().optional(),
});
