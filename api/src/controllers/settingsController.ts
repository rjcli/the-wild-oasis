import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import type { UpdateSettingsDto } from "../schemas/settingsSchemas";

// ─── GET /api/v1/settings ─────────────────────────────────────────────────────
export const getSettings = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    // Settings table always has exactly one row (id = 1). Create it if missing.
    let settings = await prisma.settings.findUnique({ where: { id: 1 } });

    if (!settings) {
      settings = await prisma.settings.create({ data: { id: 1 } });
    }

    if (!settings)
      return next(new AppError("Settings could not be loaded.", 500));

    res.status(200).json({ status: "success", data: { settings } });
  },
);

// ─── PATCH /api/v1/settings ───────────────────────────────────────────────────
export const updateSettings = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body as UpdateSettingsDto;

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: body,
      create: { id: 1, ...body },
    });

    res.status(200).json({ status: "success", data: { settings } });
  },
);
