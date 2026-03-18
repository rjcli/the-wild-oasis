import { z } from 'zod';

export const createBookingSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  numNights: z.coerce.number().int().positive(),
  numGuests: z.coerce.number().int().positive(),
  cabinId: z.coerce.number().int().positive(),
  guestId: z.coerce.number().int().positive(),
  hasBreakfast: z.boolean().default(false),
  observations: z.string().optional(),
  isPaid: z.boolean().default(false),
  totalPrice: z.coerce.number().min(0),
  cabinPrice: z.coerce.number().min(0).default(0),
  extrasPrice: z.coerce.number().min(0).default(0),
});

export const updateBookingSchema = z.object({
  status: z.enum(['unconfirmed', 'checked_in', 'checked_out']).optional(),
  isPaid: z.boolean().optional(),
  hasBreakfast: z.boolean().optional(),
  extrasPrice: z.coerce.number().min(0).optional(),
  totalPrice: z.coerce.number().min(0).optional(),
  observations: z.string().optional(),
  numGuests: z.coerce.number().int().positive().optional(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
export type UpdateBookingDto = z.infer<typeof updateBookingSchema>;
