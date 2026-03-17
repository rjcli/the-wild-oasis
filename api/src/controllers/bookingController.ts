import { Request, Response, NextFunction } from "express";
import { BookingStatus, Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { getToday } from "../utils/helpers";
import type {
  CreateBookingDto,
  UpdateBookingDto,
} from "../schemas/bookingSchemas";
import type { AuthRequest } from "../middleware/auth";

const PAGE_SIZE = 10;

// Shared booking selector — mirrors what the Supabase queries return
const bookingListSelect = {
  id: true,
  createdAt: true,
  startDate: true,
  endDate: true,
  numNights: true,
  numGuests: true,
  status: true,
  totalPrice: true,
  cabin: { select: { name: true } },
  guest: { select: { fullName: true, email: true } },
} satisfies Prisma.BookingSelect;

const bookingDetailSelect = {
  id: true,
  createdAt: true,
  startDate: true,
  endDate: true,
  numNights: true,
  numGuests: true,
  status: true,
  totalPrice: true,
  cabinPrice: true,
  extrasPrice: true,
  hasBreakfast: true,
  observations: true,
  isPaid: true,
  cabin: true,
  guest: true,
} satisfies Prisma.BookingSelect;

// ─── GET /api/v1/bookings/check-availability ─────────────────────────────────
// Returns { available: boolean } — whether a cabin is free for the given date range
export const checkCabinAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cabinId, startDate, endDate } = req.query as {
      cabinId?: string;
      startDate?: string;
      endDate?: string;
    };
    if (!cabinId || !startDate || !endDate)
      return next(
        new AppError("Please provide cabinId, startDate and endDate.", 400),
      );

    const cid = Number.parseInt(cabinId, 10);
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (
      Number.isNaN(cid) ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    )
      return next(new AppError("Invalid cabinId or date format.", 400));

    const count = await prisma.booking.count({
      where: {
        cabinId: cid,
        status: { not: "checked_out" },
        startDate: { lt: end },
        endDate: { gt: start },
      },
    });
    res
      .status(200)
      .json({ status: "success", data: { available: count === 0 } });
  },
);

// ─── GET /api/v1/bookings ─────────────────────────────────────────────────────
export const getAllBookings = catchAsync(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const {
      status,
      sortBy = "startDate-desc",
      page = "1",
    } = req.query as Record<string, string>;

    // --- Filter ---
    const where: Prisma.BookingWhereInput = {};

    // Non-admin users only see bookings they created
    if (authReq.userRole !== "admin") {
      where.createdById = authReq.userId ?? null;
    }

    if (status && status !== "all") {
      if (["unconfirmed", "checked_in", "checked_out"].includes(status)) {
        where.status = status as BookingStatus;
      }
    }

    // --- Sort ---
    const [sortField, sortDir] = sortBy.split("-");
    const allowedSortFields: Array<
      keyof Prisma.BookingOrderByWithRelationInput
    > = ["startDate", "endDate", "totalPrice", "createdAt"];
    const field = allowedSortFields.includes(
      sortField as keyof Prisma.BookingOrderByWithRelationInput,
    )
      ? (sortField as keyof Prisma.BookingOrderByWithRelationInput)
      : "startDate";
    const direction: Prisma.SortOrder = sortDir === "asc" ? "asc" : "desc";

    // --- Pagination ---
    const pageNum = Math.max(1, Number.parseInt(page, 10));
    const skip = (pageNum - 1) * PAGE_SIZE;

    const [bookings, count] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        select: bookingListSelect,
        orderBy: { [field]: direction },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.booking.count({ where }),
    ]);

    res.status(200).json({ status: "success", count, data: { bookings } });
  },
);

// ─── GET /api/v1/bookings/today-activity ─────────────────────────────────────
// Returns bookings where: (status=unconfirmed AND startDate=today) OR (status=checked_in AND endDate=today)
export const getTodayActivity = catchAsync(
  async (_req: Request, res: Response) => {
    const todayStr = getToday();
    const todayStart = new Date(todayStr);
    const todayEnd = new Date(getToday({ end: true }));

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          {
            status: "unconfirmed",
            startDate: { gte: todayStart, lte: todayEnd },
          },
          { status: "checked_in", endDate: { gte: todayStart, lte: todayEnd } },
        ],
      },
      select: {
        ...bookingDetailSelect,
        guest: {
          select: { fullName: true, nationality: true, countryFlag: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: { bookings },
    });
  },
);

// ─── GET /api/v1/bookings/after-date?date=ISO ──────────────────────────────
// Used by the dashboard to aggregate revenue/bookings for the last N days
export const getBookingsAfterDate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.query as { date?: string };
    if (!date)
      return next(
        new AppError(
          "Please provide a date query parameter (ISO string).",
          400,
        ),
      );

    const from = new Date(date);
    if (Number.isNaN(from.getTime()))
      return next(new AppError("Invalid date format.", 400));

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: new Date(getToday({ end: true })),
        },
      },
      select: { createdAt: true, totalPrice: true, extrasPrice: true },
    });

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: { bookings },
    });
  },
);

// ─── GET /api/v1/bookings/stays-after-date?date=ISO ──────────────────────
// Stays that START after a given date (with guest info for dashboard charts)
export const getStaysAfterDate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.query as { date?: string };
    if (!date)
      return next(
        new AppError(
          "Please provide a date query parameter (ISO string).",
          400,
        ),
      );

    const from = new Date(date);
    if (Number.isNaN(from.getTime()))
      return next(new AppError("Invalid date format.", 400));

    const bookings = await prisma.booking.findMany({
      where: {
        startDate: {
          gte: from,
          lte: new Date(getToday()),
        },
      },
      select: {
        ...bookingDetailSelect,
        guest: { select: { fullName: true } },
      },
    });

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: { bookings },
    });
  },
);

// ─── GET /api/v1/bookings/:id ─────────────────────────────────────────────────
export const getBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return next(new AppError("Invalid booking ID.", 400));

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: bookingDetailSelect,
    });
    if (!booking)
      return next(new AppError("No booking found with that ID.", 404));

    res.status(200).json({ status: "success", data: { booking } });
  },
);

// ─── POST /api/v1/bookings ────────────────────────────────────────────────────
export const createBooking = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const body = req.body as CreateBookingDto;

  const booking = await prisma.booking.create({
    data: { ...body, createdById: authReq.userId },
    select: bookingDetailSelect,
  });

  res.status(201).json({ status: "success", data: { booking } });
});

// ─── PATCH /api/v1/bookings/:id ───────────────────────────────────────────────
export const updateBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return next(new AppError("Invalid booking ID.", 400));

    const body = req.body as UpdateBookingDto;

    const booking = await prisma.booking.update({
      where: { id },
      data: body,
      select: bookingDetailSelect,
    });

    res.status(200).json({ status: "success", data: { booking } });
  },
);

// ─── DELETE /api/v1/bookings/:id ──────────────────────────────────────────────
export const deleteBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return next(new AppError("Invalid booking ID.", 400));

    await prisma.booking.delete({ where: { id } });

    res.status(204).json({ status: "success", data: null });
  },
);
