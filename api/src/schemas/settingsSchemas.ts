import { z } from "zod";

export const updateSettingsSchema = z
  .object({
    minBookingLength: z.coerce.number().int().positive().optional(),
    maxBookingLength: z.coerce.number().int().positive().optional(),
    maxGuestsPerBooking: z.coerce.number().int().positive().optional(),
    breakfastPrice: z.coerce.number().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateSettingsDto = z.infer<typeof updateSettingsSchema>;
