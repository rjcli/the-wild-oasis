import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';
import * as settingsController from '../../controllers/settingsController';
import { executeHandler } from '../utils/testHelpers';

jest.mock('../../config/prisma');

describe('settingsController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonSpy = jest.fn().mockReturnValue(undefined);
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });

    mockReq = { body: {} };
    mockRes = { status: statusSpy, json: jsonSpy };
    mockNext = jest.fn();
  });

  describe('getSettings', () => {
    it('should return existing settings', async () => {
      const settings = {
        id: 1,
        minBookingLength: 3,
        maxBookingLength: 30,
        maxGuestsPerBooking: 10,
        breakfastPrice: 15,
      };

      (prisma.settings.findUnique as jest.Mock).mockResolvedValue(settings);

      await executeHandler(
        settingsController.getSettings,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(prisma.settings.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: 'success',
        data: { settings },
      });
    });

    it('should create settings if not found', async () => {
      const newSettings = {
        id: 1,
        minBookingLength: 1,
        maxBookingLength: 90,
        maxGuestsPerBooking: 16,
        breakfastPrice: 15,
      };

      (prisma.settings.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.settings.create as jest.Mock).mockResolvedValue(newSettings);

      await executeHandler(
        settingsController.getSettings,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(prisma.settings.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(prisma.settings.create).toHaveBeenCalledWith({
        data: { id: 1 },
      });

      expect(statusSpy).toHaveBeenCalledWith(200);
    });

    it('should return error if settings could not be created', async () => {
      (prisma.settings.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.settings.create as jest.Mock).mockResolvedValue(null);

      await executeHandler(
        settingsController.getSettings,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateSettings', () => {
    it('should update settings', async () => {
      mockReq.body = {
        minBookingLength: 5,
        maxBookingLength: 60,
      };

      const updatedSettings = {
        id: 1,
        minBookingLength: 5,
        maxBookingLength: 60,
        maxGuestsPerBooking: 10,
        breakfastPrice: 15,
      };

      (prisma.settings.upsert as jest.Mock).mockResolvedValue(updatedSettings);

      await executeHandler(
        settingsController.updateSettings,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(prisma.settings.upsert).toHaveBeenCalledWith({
        where: { id: 1 },
        update: mockReq.body,
        create: { id: 1, ...mockReq.body },
      });

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: 'success',
        data: { settings: updatedSettings },
      });
    });

    it('should create settings if not exists', async () => {
      mockReq.body = {
        minBookingLength: 3,
        breakfastPrice: 12,
      };

      const newSettings = {
        id: 1,
        minBookingLength: 3,
        breakfastPrice: 12,
        maxBookingLength: 90,
        maxGuestsPerBooking: 16,
      };

      (prisma.settings.upsert as jest.Mock).mockResolvedValue(newSettings);

      await executeHandler(
        settingsController.updateSettings,
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(prisma.settings.upsert).toHaveBeenCalled();
      expect(statusSpy).toHaveBeenCalledWith(200);
    });
  });
});
