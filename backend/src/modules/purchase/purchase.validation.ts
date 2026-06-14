import {z} from "zod"

export const createPurchaseSchema = z.object({
    product_id: z.coerce.number().int().positive(),
    supplier_id: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().positive("Quantity must be greater than 0"),
    unit_cost: z.coerce.number().min(0, "Unit cost cannot be negative"),
    purchase_date: z.string().optional(),
    notes: z.string().trim().optional(),
})
