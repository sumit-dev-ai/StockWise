import { z } from "zod";

const optionalEmailSchema = z
  .preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.email("Invalid email").max(150, "Email should be less than 150 characters long").optional()
  );

export const createSupplierSchema = z.object({
  name: z.string()
    .trim().min(2, "Name should have at least 2 characters").max(150, "The supplier name should not exceed more than 150 characters"),

  phone: z
    .string().trim().max(20, "Phone number is too long")
    .optional(),

  email: optionalEmailSchema,

  address: z.string().trim().max(255, "Address is too long")
    .optional(),
});

export const updateSupplierSchema = z.object({
  name: z
    .string().trim()
    .min(2, "Name should have at least 2 characters").max(150, "The supplier name should not exceed more than 150 characters")
    .optional(),

  phone: z
    .string().trim().max(20, "Phone number is too long")
    .optional(),

  email: optionalEmailSchema,

  address: z.string().trim().max(255, "Address is too long")
    .optional(),
});