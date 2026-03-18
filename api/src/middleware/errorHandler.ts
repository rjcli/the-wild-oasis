import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { isDev } from '../config/env';

interface ErrorResponse {
  status: string;
  message: string;
  errors?: unknown;
  stack?: string;
}

const handlePrismaKnownError = (
  err: Prisma.PrismaClientKnownRequestError,
): AppError => {
  // Unique constraint violation
  if (err.code === 'P2002') {
    const fields = (err.meta?.target as string[])?.join(', ') ?? 'field';
    return new AppError(
      `Duplicate value for ${fields}. Please use another value.`,
      409,
    );
  }
  // Record not found
  if (err.code === 'P2025') {
    return new AppError('Record not found.', 404);
  }
  // Foreign key constraint failed
  if (err.code === 'P2003') {
    return new AppError('Related record does not exist.', 400);
  }
  return new AppError('Database error.', 500);
};

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    appError = handlePrismaKnownError(err);
  } else if (err instanceof ZodError) {
    const message = err.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');
    appError = new AppError(`Validation error — ${message}`, 400);
  } else if (err instanceof Error) {
    appError = new AppError(
      isDev ? err.message : 'Something went wrong. Please try again.',
      500,
    );
  } else {
    appError = new AppError('An unexpected error occurred.', 500);
  }

  const status = appError.statusCode >= 500 ? 'error' : 'fail';

  const body: ErrorResponse = { status, message: appError.message };

  if (appError.statusCode === 400 && err instanceof ZodError) {
    body.errors = err.errors;
  }

  if (isDev && err instanceof Error) {
    body.stack = err.stack;
  }

  res.status(appError.statusCode).json(body);
};
