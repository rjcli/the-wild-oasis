import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { globalErrorHandler } from "../../middleware/errorHandler";
import { AppError } from "../../utils/AppError";

// Mock the isDev value for testing
jest.mock("../../config/env", () => ({
  isDev: true,
}));

describe("globalErrorHandler", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let statusSpy: jest.Mock;
  let jsonSpy: jest.Mock;

  beforeEach(() => {
    statusSpy = jest.fn().mockReturnThis();
    jsonSpy = jest.fn();

    mockReq = {};
    mockRes = {
      status: statusSpy,
      json: jsonSpy,
    };
    mockNext = jest.fn();
  });

  it("should handle AppError correctly", () => {
    const error = new AppError("Test error message", 404);

    globalErrorHandler(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(404);
    // When isDev is true, stack trace is included for Error instances (including AppError)
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Test error message",
        stack: expect.any(String),
      }),
    );
  });

  it("should set status to error for 500+ status codes", () => {
    const error = new AppError("Internal server error", 500);

    globalErrorHandler(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    // When isDev is true, stack trace is included for Error instances
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Internal server error",
        stack: expect.any(String),
      }),
    );
  });

  it("should handle Prisma P2002 (unique constraint) error", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      { code: "P2002", clientVersion: "5.15.0", meta: { target: ["email"] } },
    );

    globalErrorHandler(
      prismaError,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(409);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: expect.stringContaining("Duplicate value"),
      }),
    );
  });

  it("should handle Prisma P2025 (record not found) error", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Record not found",
      { code: "P2025", clientVersion: "5.15.0" },
    );

    globalErrorHandler(
      prismaError,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Record not found.",
      }),
    );
  });

  it("should handle Prisma P2003 (foreign key constraint) error", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Foreign key constraint failed",
      { code: "P2003", clientVersion: "5.15.0" },
    );

    globalErrorHandler(
      prismaError,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Related record does not exist.",
      }),
    );
  });

  it("should handle ZodError validation error", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["email"],
        message: "Expected string, received number",
      },
    ]);

    globalErrorHandler(
      zodError,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: expect.stringContaining("Validation error"),
        errors: expect.any(Array),
      }),
    );
  });

  it("should handle generic Error", () => {
    const error = new Error("Generic error message");

    globalErrorHandler(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    // When isDev is true (mocked), error message and stack are included
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Generic error message",
        stack: expect.any(String),
      }),
    );
  });

  it("should include stack trace in development", () => {
    const error = new Error("Generic error message");
    globalErrorHandler(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        stack: expect.any(String),
      }),
    );
  });

  it("should handle unknown error type", () => {
    const unknownError = { something: "unknown" };

    globalErrorHandler(
      unknownError,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "An unexpected error occurred.",
      }),
    );
  });

  it("should handle Prisma error with multiple target fields", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "5.15.0",
        meta: { target: ["email", "username"] },
      },
    );

    globalErrorHandler(
      prismaError,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(409);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("email, username"),
      }),
    );
  });

  it("should handle Prisma error without target metadata", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      { code: "P2002", clientVersion: "5.15.0" },
    );

    globalErrorHandler(
      prismaError,
      mockReq as Request,
      mockRes as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(409);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("field"),
      }),
    );
  });
});
