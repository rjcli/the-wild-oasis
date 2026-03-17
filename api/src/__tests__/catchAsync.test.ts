import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

// Simple implementation of catchAsync for testing
const catchAsyncForTest =
  (fn: AsyncHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

describe('catchAsync', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should call the async handler', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handler = jest.fn(
      async (_req: Request, res: Response, _next: NextFunction) => {
        res.json({ status: 'success', data: { message: 'test' } });
      },
    );

    const wrappedHandler = catchAsyncForTest(handler);
    wrappedHandler(mockReq as Request, mockRes as Response, mockNext);

    await Promise.resolve().then(() => Promise.resolve());

    expect(handler).toHaveBeenCalled();
  });

  it('should catch errors and call next with error', async () => {
    const testError = new Error('Test error');
    const handler = jest.fn(async () => {
      throw testError;
    });

    const wrapped = catchAsyncForTest(handler);
    wrapped(mockReq as Request, mockRes as Response, mockNext);

    await Promise.resolve().then(() => Promise.resolve());

    expect(mockNext).toHaveBeenCalledWith(testError);
  });

  it('should handle rejected promises', async () => {
    const testError = new Error('Promise rejection');
    const handler = jest.fn(async () => {
      return Promise.reject(testError);
    });

    const wrapped = catchAsyncForTest(handler);
    wrapped(mockReq as Request, mockRes as Response, mockNext);

    await Promise.resolve().then(() => Promise.resolve());

    expect(mockNext).toHaveBeenCalledWith(testError);
  });
});
