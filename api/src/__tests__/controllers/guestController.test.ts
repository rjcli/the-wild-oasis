import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma";
import * as guestController from "../../controllers/guestController";

jest.mock("../../config/prisma");

describe("guestController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonSpy = jest.fn().mockReturnValue(undefined);
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });

    mockReq = { params: {}, body: {} };
    mockRes = { status: statusSpy, json: jsonSpy };
    mockNext = jest.fn();
  });

  describe("getAllGuests", () => {
    it("should return all guests sorted by fullName", async () => {
      const guests = [
        { id: 1, fullName: "Alice", email: "alice@example.com" },
        { id: 2, fullName: "Bob", email: "bob@example.com" },
      ];

      (prisma.guest.findMany as jest.Mock).mockResolvedValue(guests);

      guestController.getAllGuests(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.guest.findMany).toHaveBeenCalledWith({
        orderBy: { fullName: "asc" },
      });

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        results: 2,
        data: { guests },
      });
    });

    it("should handle empty guest list", async () => {
      (prisma.guest.findMany as jest.Mock).mockResolvedValue([]);

      guestController.getAllGuests(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        results: 0,
        data: { guests: [] },
      });
    });
  });

  describe("getGuest", () => {
    it("should return 400 for invalid guest ID", () => {
      mockReq.params = { id: "invalid" };

      guestController.getGuest(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return 404 if guest not found", async () => {
      mockReq.params = { id: "999" };
      (prisma.guest.findUnique as jest.Mock).mockResolvedValue(null);

      guestController.getGuest(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return guest with bookings", async () => {
      mockReq.params = { id: "1" };
      const guest = {
        id: 1,
        fullName: "John Doe",
        email: "john@example.com",
        bookings: [
          { id: 1, startDate: new Date("2026-03-20") },
          { id: 2, startDate: new Date("2026-02-20") },
        ],
      };

      (prisma.guest.findUnique as jest.Mock).mockResolvedValue(guest);

      guestController.getGuest(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.guest.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { bookings: { orderBy: { startDate: "desc" } } },
      });

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { guest },
      });
    });
  });

  describe("createGuest", () => {
    it("should create a new guest", async () => {
      mockReq.body = {
        fullName: "Jane Doe",
        email: "jane@example.com",
        nationality: "US",
      };

      const guest = {
        id: 1,
        fullName: "Jane Doe",
        email: "jane@example.com",
        nationality: "US",
      };

      (prisma.guest.create as jest.Mock).mockResolvedValue(guest);

      guestController.createGuest(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.guest.create).toHaveBeenCalledWith({
        data: mockReq.body,
      });

      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { guest },
      });
    });
  });

  describe("updateGuest", () => {
    it("should return 400 for invalid guest ID", () => {
      mockReq.params = { id: "invalid" };
      mockReq.body = { fullName: "Updated" };

      guestController.updateGuest(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should update guest", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { fullName: "Updated Name", email: "updated@example.com" };

      const guest = {
        id: 1,
        fullName: "Updated Name",
        email: "updated@example.com",
      };

      (prisma.guest.update as jest.Mock).mockResolvedValue(guest);

      guestController.updateGuest(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.guest.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockReq.body,
      });

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { guest },
      });
    });
  });

  describe("deleteGuest", () => {
    it("should return 400 for invalid guest ID", () => {
      mockReq.params = { id: "invalid" };

      guestController.deleteGuest(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should delete guest", async () => {
      mockReq.params = { id: "1" };
      (prisma.guest.delete as jest.Mock).mockResolvedValue({});

      guestController.deleteGuest(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.guest.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(statusSpy).toHaveBeenCalledWith(204);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: null,
      });
    });
  });
});
