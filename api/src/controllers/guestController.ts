import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import type { CreateGuestDto, UpdateGuestDto } from '../schemas/guestSchemas';

// ─── GET /api/v1/guests ───────────────────────────────────────────────────────
export const getAllGuests = catchAsync(async (_req: Request, res: Response) => {
  const guests = await prisma.guest.findMany({ orderBy: { fullName: 'asc' } });
  res
    .status(200)
    .json({ status: 'success', results: guests.length, data: { guests } });
});

// ─── GET /api/v1/guests/:id ───────────────────────────────────────────────────
export const getGuest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return next(new AppError('Invalid guest ID.', 400));

    const guest = await prisma.guest.findUnique({
      where: { id },
      include: { bookings: { orderBy: { startDate: 'desc' } } },
    });
    if (!guest) return next(new AppError('No guest found with that ID.', 404));

    res.status(200).json({ status: 'success', data: { guest } });
  },
);

// ─── POST /api/v1/guests ──────────────────────────────────────────────────────
export const createGuest = catchAsync(async (req: Request, res: Response) => {
  const body = req.body as CreateGuestDto;
  const guest = await prisma.guest.create({ data: body });
  res.status(201).json({ status: 'success', data: { guest } });
});

// ─── PATCH /api/v1/guests/:id ─────────────────────────────────────────────────
export const updateGuest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return next(new AppError('Invalid guest ID.', 400));

    const body = req.body as UpdateGuestDto;
    const guest = await prisma.guest.update({ where: { id }, data: body });
    res.status(200).json({ status: 'success', data: { guest } });
  },
);

// ─── DELETE /api/v1/guests/:id ───────────────────────────────────────────────
export const deleteGuest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return next(new AppError('Invalid guest ID.', 400));

    await prisma.guest.delete({ where: { id } });
    res.status(204).json({ status: 'success', data: null });
  },
);
