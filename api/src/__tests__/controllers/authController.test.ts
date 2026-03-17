import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import { AuthRequest } from "../../middleware/auth";
import * as authController from "../../controllers/authController";
import { executeHandler } from "../utils/testHelpers";

jest.mock("../../config/prisma");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("authController", () => {
  let mockReq: Partial<AuthRequest>;
  let mockAuthReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonSpy = jest.fn().mockReturnValue(undefined);
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });

    mockReq = { body: {} };
    mockAuthReq = { userId: "user-123", body: {} };
    mockRes = { status: statusSpy, json: jsonSpy };
    mockNext = jest.fn();
  });

  describe("login", () => {
    it("should return 401 for invalid email", async () => {
      mockReq.body = { email: "wrong@example.com", password: "password" };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await executeHandler(
        authController.login,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return tokens on successful login", async () => {
      mockReq.body = { email: "test@example.com", password: "password" };
      const user = {
        id: "user-123",
        email: "test@example.com",
        password: "hashed",
        fullName: "Test User",
        avatar: null,
        role: "user" as const,
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      await executeHandler(
        authController.login,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe("signup", () => {
    it("should hash password and create user", async () => {
      mockReq.body = {
        email: "new@example.com",
        password: "password123",
        fullName: "New User",
      };

      const user = {
        id: "new-user",
        email: "new@example.com",
        password: "hashed",
        fullName: "New User",
        avatar: null,
        role: "user" as const,
        createdAt: new Date(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
      (prisma.user.create as jest.Mock).mockResolvedValue(user);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      await executeHandler(
        authController.signup,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
      expect(statusSpy).toHaveBeenCalledWith(201);
    });
  });

  describe("refreshToken", () => {
    it("should return new access token", async () => {
      mockReq.body = { refreshToken: "valid-refresh" };
      const user = {
        id: "user-123",
        email: "test@example.com",
        password: "hashed",
      };

      (jwt.verify as jest.Mock).mockReturnValue({ sub: "user-123" });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (jwt.sign as jest.Mock).mockReturnValue("new-token");

      await executeHandler(
        authController.refreshToken,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
    });

    it("should return 401 if refresh token is invalid", async () => {
      mockReq.body = { refreshToken: "invalid-token" };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await executeHandler(
        authController.refreshToken,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return 401 if user not found after token verification", async () => {
      mockReq.body = { refreshToken: "valid-token" };

      (jwt.verify as jest.Mock).mockReturnValue({ sub: "nonexistent-user" });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await executeHandler(
        authController.refreshToken,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getMe", () => {
    it("should return current user", async () => {
      mockAuthReq.userId = "user-123";
      const user = {
        id: "user-123",
        email: "test@example.com",
        fullName: "Test User",
        avatar: "avatar.jpg",
        role: "admin" as const,
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

      await executeHandler(
        authController.getMe,
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe("updateMe", () => {
    it("should update user", async () => {
      mockAuthReq.userId = "user-123";
      mockAuthReq.body = { fullName: "Updated Name" };
      mockAuthReq.file = undefined;

      const user = {
        id: "user-123",
        email: "test@example.com",
        fullName: "Updated Name",
        avatar: null,
        role: "user" as const,
        createdAt: new Date(),
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(user);

      await executeHandler(
        authController.updateMe,
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = [
        {
          id: "user-1",
          email: "user1@example.com",
          fullName: "User 1",
          avatar: null,
          role: "user" as const,
          createdAt: new Date(),
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(users);

      await executeHandler(
        authController.getAllUsers,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe("adminUpdateUser", () => {
    it("should update user role", async () => {
      mockReq.params = { id: "user-123" };
      mockReq.body = { role: "admin", fullName: "New Name" };

      const user = { id: "user-123", email: "test@example.com" };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...user,
        role: "admin",
      });

      await executeHandler(
        authController.adminUpdateUser,
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe("adminDeleteUser", () => {
    it("should delete user", async () => {
      mockAuthReq.userId = "admin-id";
      mockReq.params = { id: "user-to-delete" };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "user-to-delete",
      });
      (prisma.user.delete as jest.Mock).mockResolvedValue({});

      await executeHandler(
        authController.adminDeleteUser,
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );

      expect(statusSpy).toHaveBeenCalledWith(204);
    });

    it("should not delete own account", async () => {
      mockReq.userId = "user-123";
      mockReq.params = { id: "user-123" };

      await executeHandler(
        authController.adminDeleteUser,
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("updatePassword", () => {
    it("should update password", async () => {
      mockAuthReq.userId = "user-123";
      mockAuthReq.body = { currentPassword: "old", newPassword: "new" };

      const user = { id: "user-123", password: "hashed-old" };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-new");
      (prisma.user.update as jest.Mock).mockResolvedValue({});
      (jwt.sign as jest.Mock).mockReturnValue("token");

      await executeHandler(
        authController.updatePassword,
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
    });

    it("should return 401 for wrong password", async () => {
      mockAuthReq.userId = "user-123";
      mockAuthReq.body = { currentPassword: "wrong", newPassword: "new" };

      const user = { id: "user-123", password: "hashed" };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await executeHandler(
        authController.updatePassword,
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
