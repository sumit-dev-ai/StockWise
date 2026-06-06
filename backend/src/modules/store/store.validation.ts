import {z} from "zod";

export const createStoreSchema = z.object({
    name : z.string().trim().min(2, "store name must contain atleast 2 characters"),
    location : z.string().trim().optional(),
    business_type : z.string().trim().optional(),
    currency : z.string().trim().default("INR").optional(),
});

export const updateStoreSchema = z.object({
  name: z.string().trim().min(2).optional(),
  location: z.string().trim().optional(),
  business_type: z.string().trim().optional(),
  currency: z.string().trim().optional(),
});