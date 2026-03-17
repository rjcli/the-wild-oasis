import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma";
import * as cabinController from "../../controllers/cabinController";

jest.mock("../../config/prisma");

describe("cabinController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonSpy = jest.fn().mockReturnValue(undefined);
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });

    mockReq = { query: {}, params: {}, body: {} };
    mockRes = { status: statusSpy, json: jsonSpy };
    mockNext = jest.fn();
  });

  describe("getAllCabins", () => {
    it("should return all cabins sorted by name", async () => {
      const cabins = [
        { id: 1, name: "Cabin A", capacity: 4 },
        { id: 2, name: "Cabin B", capacity: 2 },
      ];

      (prisma.cabin.findMany as jest.Mock).mockResolvedValue(cabins);

      cabinController.getAllCabins(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.cabin.findMany).toHaveBeenCalledWith({
        orderBy: { name: "asc" },
      });

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        results: 2,
        data: { cabins },
      });
    });

    it("should return empty array if no cabins", async () => {
      (prisma.cabin.findMany as jest.Mock).mockResolvedValue([]);

      cabinController.getAllCabins(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        results: 0,
        data: { cabins: [] },
      });
    });
  });

  describe("getCabinsStatus", () => {
    it("should return booked cabin IDs for date range", async () => {
      mockReq.query = {
        startDate: "2026-03-20",
        endDate: "2026-03-25",
      };

      const bookings = [{ cabinId: 1 }, { cabinId: 2 }, { cabinId: 1 }];

      (prisma.booking.findMany as jest.Mock).mockResolvedValue(bookings);

      cabinController.getCabinsStatus(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { bookedCabinIds: [1, 2] },
      });
    });

    it("should return empty array if no bookings for date range", async () => {
      (prisma.booking.findMany as jest.Mock).mockResolvedValue([]);

      cabinController.getCabinsStatus(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { bookedCabinIds: [] },
      });
    });
  });

  describe("getCabin", () => {
    it("should return 400 for invalid cabin ID", () => {
      mockReq.params = { id: "invalid" };

      cabinController.getCabin(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return 404 if cabin not found", async () => {
      mockReq.params = { id: "999" };
      (prisma.cabin.findUnique as jest.Mock).mockResolvedValue(null);

      cabinController.getCabin(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return cabin details", async () => {
      mockReq.params = { id: "1" };
      const cabin = { id: 1, name: "Cabin A", capacity: 4, price: 100 };

      (prisma.cabin.findUnique as jest.Mock).mockResolvedValue(cabin);

      cabinController.getCabin(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { cabin },
      });
    });
  });

  describe("createCabin", () => {
    it("should create cabin without image", async () => {
      mockReq.body = {
        name: "New Cabin",
        capacity: 4,
        price: 100,
      };
      mockReq.file = undefined;

      const cabin = { id: 1, name: "New Cabin", capacity: 4, price: 100 };

      (prisma.cabin.create as jest.Mock).mockResolvedValue(cabin);

      cabinController.createCabin(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.cabin.create).toHaveBeenCalledWith({
        data: mockReq.body,
      });

      expect(statusSpy).toHaveBeenCalledWith(201);
    });

    it("should create cabin with image", async () => {
      mockReq.body = {
        name: "New Cabin",
        capacity: 4,
        price: 100,
      };

      const cabin = {
        id: 1,
        name: "New Cabin",
        capacity: 4,
        price: 100,
        image: "uploads/cabins/cabin-123.jpeg",
      };

      (prisma.cabin.create as jest.Mock).mockResolvedValue(cabin);

      cabinController.createCabin(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: "success",
        data: { cabin },
      });
    });
  });

  describe("updateCabin", () => {
    it("should return 400 for invalid cabin ID", () => {
      mockReq.params = { id: "invalid" };
      mockReq.body = { name: "Updated" };

      cabinController.updateCabin(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should update cabin without image", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { name: "Updated Cabin" };
      mockReq.file = undefined;

      const cabin = { id: 1, name: "Updated Cabin", capacity: 4 };

      (prisma.cabin.update as jest.Mock).mockResolvedValue(cabin);

      cabinController.updateCabin(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.cabin.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockReq.body,
      });

      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteCabin", () => {
    it("should return 400 for invalid cabin ID", () => {
      mockReq.params = { id: "invalid" };

      cabinController.deleteCabin(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should delete cabin", async () => {
      mockReq.params = { id: "1" };
      (prisma.cabin.delete as jest.Mock).mockResolvedValue({});

      cabinController.deleteCabin(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
      await Promise.resolve();

      expect(prisma.cabin.delete).toHaveBeenCalledWith({
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
