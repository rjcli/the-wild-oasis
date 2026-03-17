import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import prisma from "../config/prisma";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(
        new AppError(
          "You are not logged in. Please log in to get access.",
          401,
        ),
      );
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      return next(
        new AppError("Invalid or expired token. Please log in again.", 401),
      );
    }

    // 3. Check user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401),
      );
    }

    req.userId = user.id;
    (req as AuthRequest).userRole = user.role;
    next();
  } catch (err) {
    next(err);
  }
};
