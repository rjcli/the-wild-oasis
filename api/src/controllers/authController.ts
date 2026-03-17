import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "node:path";
import sharp from "sharp";
import { env } from "../config/env";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { avatarUploadsDir } from "../middleware/upload";
import type { AuthRequest } from "../middleware/auth";
import type {
  LoginDto,
  SignupDto,
  UpdatePasswordDto,
  UpdateMeDto,
  AdminUpdateUserDto,
} from "../schemas/authSchemas";

const signAccessToken = (userId: string): string =>
  jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

const signRefreshToken = (userId: string): string =>
  jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

const sanitizeUser = (user: {
  id: string;
  email: string;
  fullName: string;
  avatar: string | null;
  role: "admin" | "user";
  createdAt: Date;
}) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  avatar: user.avatar,
  role: user.role,
  createdAt: user.createdAt,
});

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as LoginDto;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("Invalid email or password.", 401));
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    res.status(200).json({
      status: "success",
      data: {
        accessToken,
        refreshToken,
        user: sanitizeUser(user),
      },
    });
  },
);

export const signup = catchAsync(async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body as SignupDto;

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashed, fullName },
  });

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  res.status(201).json({
    status: "success",
    data: {
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
    },
  });
});

export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken: token } = req.body as { refreshToken: string };

    let decoded: { sub: string };
    try {
      decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
    } catch {
      return next(
        new AppError(
          "Invalid or expired refresh token. Please log in again.",
          401,
        ),
      );
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) return next(new AppError("User not found.", 401));

    const accessToken = signAccessToken(user.id);
    const newRefreshToken = signRefreshToken(user.id);

    res.status(200).json({
      status: "success",
      data: { accessToken, refreshToken: newRefreshToken },
    });
  },
);

export const getMe = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) return next(new AppError("User not found.", 404));

    res.status(200).json({ status: "success", data: { user } });
  },
);

export const updateMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const { fullName } = req.body as UpdateMeDto;

  let avatarPath: string | undefined;

  if (req.file) {
    const filename = `avatar-${req.userId}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(path.join(avatarUploadsDir, filename));
    avatarPath = `uploads/avatars/${filename}`;
  }

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: {
      ...(fullName && { fullName }),
      ...(avatarPath && { avatar: avatarPath }),
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
  });

  res.status(200).json({ status: "success", data: { user } });
});

export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
});

export const adminUpdateUser = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { fullName, role } = req.body as AdminUpdateUserDto;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return next(new AppError("User not found.", 404));

    const user = await prisma.user.update({
      where: { id },
      data: { ...(fullName && { fullName }), ...(role && { role }) },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({ status: "success", data: { user } });
  },
);

export const adminDeleteUser = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (req.userId === id)
      return next(new AppError("You cannot delete your own account.", 400));

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return next(new AppError("User not found.", 404));

    await prisma.user.delete({ where: { id } });
    res.status(204).json({ status: "success", data: null });
  },
);

export const updatePassword = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body as UpdatePasswordDto;

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return next(new AppError("User not found.", 404));

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return next(new AppError("Your current password is wrong.", 401));
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashed },
    });

    const accessToken = signAccessToken(user.id);
    const newRefreshToken = signRefreshToken(user.id);

    res.status(200).json({
      status: "success",
      message: "Password updated successfully.",
      data: { accessToken, refreshToken: newRefreshToken },
    });
  },
);
