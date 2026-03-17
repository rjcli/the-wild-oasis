import { z } from "zod";

export const createGuestSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  nationality: z.string().optional(),
  nationalId: z.string().optional(),
  countryFlag: z.string().url("Invalid URL for country flag").optional(),
  age: z.coerce.number().int().min(0).max(130).optional(),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be male, female, or other",
  }),
});

export const updateGuestSchema = createGuestSchema.partial();

export type CreateGuestDto = z.infer<typeof createGuestSchema>;
export type UpdateGuestDto = z.infer<typeof updateGuestSchema>;
