import { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import sharp from 'sharp';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { cabinUploadsDir } from '../middleware/upload';
import type { CreateCabinDto, UpdateCabinDto } from '../schemas/cabinSchemas';

// ─── GET /api/v1/cabins ───────────────────────────────────────────────────────
export const getAllCabins = catchAsync(async (_req: Request, res: Response) => {
  const cabins = await prisma.cabin.findMany({ orderBy: { name: 'asc' } });
  res
    .status(200)
    .json({ status: 'success', results: cabins.length, data: { cabins } });
});

// ─── GET /api/v1/cabins/status ────────────────────────────────────────────────
// Returns IDs of cabins that have an overlapping booking in the given date range.
// Query params: startDate (ISO string), endDate (ISO string) — defaults to today.
export const getCabinsStatus = catchAsync(
  async (req: Request, res: Response) => {
    const now = new Date();
    const start = req.query.startDate
      ? new Date(req.query.startDate as string)
      : now;
    const end = req.query.endDate ? new Date(req.query.endDate as string) : now;

    // A booking overlaps the range [start, end] when:
    //   booking.startDate < end  AND  booking.endDate > start
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['unconfirmed', 'checked_in'] },
        startDate: { lt: end },
        endDate: { gt: start },
      },
      select: { cabinId: true },
    });
    const bookedCabinIds = [...new Set(bookings.map((b) => b.cabinId))];
    res.status(200).json({ status: 'success', data: { bookedCabinIds } });
  },
);

// ─── GET /api/v1/cabins/:id ───────────────────────────────────────────────────
export const getCabin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return next(new AppError('Invalid cabin ID.', 400));

    const cabin = await prisma.cabin.findUnique({ where: { id } });
    if (!cabin) return next(new AppError('No cabin found with that ID.', 404));

    res.status(200).json({ status: 'success', data: { cabin } });
  },
);

// ─── POST /api/v1/cabins ──────────────────────────────────────────────────────
export const createCabin = catchAsync(async (req: Request, res: Response) => {
  const body = req.body as CreateCabinDto;

  let imagePath: string | undefined;
  if (req.file) {
    const filename = `cabin-${Date.now()}-${Math.random().toString(36).slice(2)}.jpeg`;
    await sharp(req.file.buffer)
      .resize(800, 600, { fit: 'cover' })
      .toFormat('jpeg')
      .jpeg({ quality: 85 })
      .toFile(path.join(cabinUploadsDir, filename));
    imagePath = `uploads/cabins/${filename}`;
  }

  const cabin = await prisma.cabin.create({
    data: { ...body, ...(imagePath && { image: imagePath }) },
  });

  res.status(201).json({ status: 'success', data: { cabin } });
});

// ─── PATCH /api/v1/cabins/:id ─────────────────────────────────────────────────
export const updateCabin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return next(new AppError('Invalid cabin ID.', 400));

    const body = req.body as UpdateCabinDto;

    let imagePath: string | undefined;
    if (req.file) {
      const filename = `cabin-${Date.now()}-${Math.random().toString(36).slice(2)}.jpeg`;
      await sharp(req.file.buffer)
        .resize(800, 600, { fit: 'cover' })
        .toFormat('jpeg')
        .jpeg({ quality: 85 })
        .toFile(path.join(cabinUploadsDir, filename));
      imagePath = `uploads/cabins/${filename}`;
    }

    const cabin = await prisma.cabin.update({
      where: { id },
      data: { ...body, ...(imagePath && { image: imagePath }) },
    });

    res.status(200).json({ status: 'success', data: { cabin } });
  },
);

// ─── DELETE /api/v1/cabins/:id ────────────────────────────────────────────────
export const deleteCabin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return next(new AppError('Invalid cabin ID.', 400));

    await prisma.cabin.delete({ where: { id } });

    res.status(204).json({ status: 'success', data: null });
  },
);
