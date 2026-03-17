import { AppError } from "../utils/AppError";

describe("AppError", () => {
  it("should create an AppError with message and statusCode", () => {
    const error = new AppError("Test error message", 404);

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Test error message");
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });

  it("should have correct statusCode for different HTTP errors", () => {
    const badRequest = new AppError("Bad request", 400);
    const unauthorized = new AppError("Unauthorized", 401);
    const forbidden = new AppError("Forbidden", 403);
    const notFound = new AppError("Not found", 404);
    const conflict = new AppError("Conflict", 409);
    const serverError = new AppError("Server error", 500);

    expect(badRequest.statusCode).toBe(400);
    expect(unauthorized.statusCode).toBe(401);
    expect(forbidden.statusCode).toBe(403);
    expect(notFound.statusCode).toBe(404);
    expect(conflict.statusCode).toBe(409);
    expect(serverError.statusCode).toBe(500);
  });

  it("should maintain proper stack trace", () => {
    const error = new AppError("Test error", 500);

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("AppError");
  });

  it("should have isOperational set to true", () => {
    const error = new AppError("Operational error", 400);

    expect(error.isOperational).toBe(true);
  });

  it("should be throwable and catchable", () => {
    const throwError = () => {
      throw new AppError("Test throwable error", 500);
    };

    expect(throwError).toThrow(AppError);
    expect(throwError).toThrow("Test throwable error");
  });

  it("should inherit from Error class properly", () => {
    const error = new AppError("Error message", 400);

    expect(error instanceof AppError).toBe(true);
    expect(error instanceof Error).toBe(true);
    expect(Object.getPrototypeOf(error)).toBeInstanceOf(Error);
  });
});
