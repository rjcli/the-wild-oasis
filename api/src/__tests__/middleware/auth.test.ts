import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import { protect, AuthRequest } from "../../middleware/auth";
import { Response, NextFunction } from "express";

jest.mock("../../config/prisma");
jest.mock("jsonwebtoken");

describe("protect middleware", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = jest.fn();
  });

  it("should return 401 if Authorization header is missing", async () => {
    mockReq.headers = {};

    protect(mockReq as AuthRequest, mockRes as Response, mockNext);
    await Promise.resolve();

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return 401 if token is invalid", async () => {
    mockReq.headers = { authorization: "Bearer invalid" };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    protect(mockReq as AuthRequest, mockRes as Response, mockNext);
    await Promise.resolve();

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should set userId and userRole on success", async () => {
    mockReq.headers = { authorization: "Bearer valid-token" };
    const user = { id: "user-123", email: "test@example.com", role: "admin" };

    (jwt.verify as jest.Mock).mockReturnValue({ sub: "user-123" });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

    protect(mockReq as AuthRequest, mockRes as Response, mockNext);
    await Promise.resolve();

    expect(mockReq.userId).toBe("user-123");
    expect(mockReq.userRole).toBe("admin");
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("should return 401 if user not found", async () => {
    mockReq.headers = { authorization: "Bearer valid-token" };
    (jwt.verify as jest.Mock).mockReturnValue({ sub: "nonexistent" });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    protect(mockReq as AuthRequest, mockRes as Response, mockNext);
    await Promise.resolve();

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
