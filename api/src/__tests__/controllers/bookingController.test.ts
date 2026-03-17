import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma";
import { AuthRequest } from "../../middleware/auth";
import * as bookingController from "../../controllers/bookingController";

jest.mock("../../config/prisma");

describe("bookingController", () => {
  let mockReq: Partial<Request>;
  let mockAuthReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonSpy = jest.fn().mockReturnValue(undefined);
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });

    mockReq = { query: {}, params: {} };
    mockAuthReq = {
      userId: "user-123",
      userRole: "user",
      query: {},
      params: {},
    };
    mockRes = { status: statusSpy, json: jsonSpy };
    mockNext = jest.fn();
  });

  describe("checkCabinAvailability", () => {
    it("should return 400 if missing required query params", () => {
      mockReq.query = { cabinId: "1" };

      bookingController.checkCabinAvailability(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return available as true when no overlapping bookings", async () => {
      mockReq.query = {
        cabinId: "1",
        startDate: "2026-03-20",
        endDate: "2026-03-25",
      };

      (prisma.booking.count as jest.Mock).mockResolvedValue(0);

      bookingController.checkCabinAvailability(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { available: true },
      });
    });

    it("should return available as false when overlapping bookings exist", async () => {
      mockReq.query = {
        cabinId: "1",
        startDate: "2026-03-20",
        endDate: "2026-03-25",
      };

      (prisma.booking.count as jest.Mock).mockResolvedValue(1);

      bookingController.checkCabinAvailability(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { available: false },
      });
    });
  });

  describe("getAllBookings", () => {
    it("should return all bookings for admin", async () => {
      mockAuthReq.userRole = "admin";
      mockAuthReq.query = {};

      const bookings = [
        { id: 1, status: "unconfirmed", totalPrice: 100 },
        { id: 2, status: "checked_in", totalPrice: 200 },
      ];

      (prisma.$transaction as jest.Mock).mockResolvedValue([bookings, 2]);

      bookingController.getAllBookings(
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        count: 2,
        data: { bookings },
      });
    });

    it("should return only user-created bookings for non-admin", async () => {
      mockAuthReq.userRole = "user";
      mockAuthReq.userId = "user-123";
      mockAuthReq.query = {};

      const bookings = [{ id: 1, status: "unconfirmed" }];

      (prisma.$transaction as jest.Mock).mockResolvedValue([bookings, 1]);

      bookingController.getAllBookings(
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it("should filter by status and handle valid status values", async () => {
      mockAuthReq.userRole = "admin";
      mockAuthReq.query = { status: "checked_in" };

      const bookings: any[] = [{ id: 1, status: "checked_in" }];

      (prisma.$transaction as jest.Mock).mockResolvedValue([bookings, 1]);

      bookingController.getAllBookings(
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
    });

    it("should ignore invalid status values", async () => {
      mockAuthReq.userRole = "admin";
      mockAuthReq.query = { status: "invalid_status" };

      const bookings: any[] = [];

      (prisma.$transaction as jest.Mock).mockResolvedValue([bookings, 0]);

      bookingController.getAllBookings(
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
    });

    it("should use default sort field for invalid sortBy", async () => {
      mockAuthReq.userRole = "admin";
      mockAuthReq.query = { sortBy: "invalidField-asc" };

      const bookings: any[] = [];

      (prisma.$transaction as jest.Mock).mockResolvedValue([bookings, 0]);

      bookingController.getAllBookings(
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
    });

    it("should handle ascending sort direction", async () => {
      mockAuthReq.userRole = "admin";
      mockAuthReq.query = { sortBy: "totalPrice-asc" };

      const bookings: any[] = [];

      (prisma.$transaction as jest.Mock).mockResolvedValue([bookings, 0]);

      bookingController.getAllBookings(
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe("getTodayActivity", () => {
    it("should return today activities", async () => {
      const bookings = [
        { id: 1, status: "unconfirmed", guest: { fullName: "John" } },
      ];

      (prisma.booking.findMany as jest.Mock).mockResolvedValue(bookings);

      bookingController.getTodayActivity(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          results: 1,
          data: { bookings },
        }),
      );
    });
  });

  describe("getBookingsAfterDate", () => {
    it("should return 400 if date not provided", () => {
      mockReq.query = {};

      bookingController.getBookingsAfterDate(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return bookings after date", async () => {
      mockReq.query = { date: "2026-03-01" };
      const bookings = [{ id: 1, totalPrice: 100 }];

      (prisma.booking.findMany as jest.Mock).mockResolvedValue(bookings);

      bookingController.getBookingsAfterDate(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe("getStaysAfterDate", () => {
    it("should return 400 if date not provided", () => {
      mockReq.query = {};

      bookingController.getStaysAfterDate(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return stays after date", async () => {
      mockReq.query = { date: "2026-03-01" };
      const bookings = [{ id: 1, guest: { fullName: "John" } }];

      (prisma.booking.findMany as jest.Mock).mockResolvedValue(bookings);

      bookingController.getStaysAfterDate(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe("getBooking", () => {
    it("should return 400 for invalid booking ID", () => {
      mockReq.params = { id: "invalid" };

      bookingController.getBooking(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return 404 if booking not found", async () => {
      mockReq.params = { id: "999" };
      (prisma.booking.findUnique as jest.Mock).mockResolvedValue(null);

      bookingController.getBooking(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return booking details", async () => {
      mockReq.params = { id: "1" };
      const booking = { id: 1, status: "unconfirmed", totalPrice: 100 };

      (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);

      bookingController.getBooking(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { booking },
      });
    });
  });

  describe("createBooking", () => {
    it("should create a new booking", async () => {
      mockAuthReq.userId = "user-123";
      mockAuthReq.body = {
        cabinId: 1,
        guestId: 1,
        startDate: "2026-03-20",
        endDate: "2026-03-25",
        numGuests: 2,
      };

      const booking = {
        id: 1,
        cabinId: 1,
        guestId: 1,
        status: "unconfirmed",
        totalPrice: 100,
      };

      (prisma.booking.create as jest.Mock).mockResolvedValue(booking);

      bookingController.createBooking(
        mockAuthReq as AuthRequest,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            createdById: "user-123",
          }),
        }),
      );

      expect(statusSpy).toHaveBeenCalledWith(201);
    });
  });

  describe("updateBooking", () => {
    it("should return 400 for invalid booking ID", () => {
      mockReq.params = { id: "invalid" };
      mockReq.body = { status: "checked_in" };

      bookingController.updateBooking(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should update booking", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { status: "checked_in" };

      const booking = { id: 1, status: "checked_in", totalPrice: 100 };

      (prisma.booking.update as jest.Mock).mockResolvedValue(booking);

      bookingController.updateBooking(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { booking },
      });
    });
  });

  describe("deleteBooking", () => {
    it("should return 400 for invalid booking ID", () => {
      mockReq.params = { id: "invalid" };

      bookingController.deleteBooking(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should delete booking", async () => {
      mockReq.params = { id: "1" };
      (prisma.booking.delete as jest.Mock).mockResolvedValue({});

      bookingController.deleteBooking(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.booking.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(statusSpy).toHaveBeenCalledWith(204);
    });
  });
});
