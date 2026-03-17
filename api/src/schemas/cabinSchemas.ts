import { z } from "zod";

export const createCabinSchema = z.object({
  cabinNumber: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  maxCapacity: z.coerce
    .number()
    .int()
    .positive("Max capacity must be a positive integer"),
  regularPrice: z.coerce.number().positive("Regular price must be positive"),
  discount: z.coerce.number().min(0, "Discount cannot be negative").default(0),
  description: z.string().optional(),
});

export const updateCabinSchema = createCabinSchema.partial();

export type CreateCabinDto = z.infer<typeof createCabinSchema>;
export type UpdateCabinDto = z.infer<typeof updateCabinSchema>;
