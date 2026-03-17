import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate';
import { AppError } from '../../utils/AppError';

describe('validate middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should validate body with valid data', () => {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    mockReq.body = { name: 'John', email: 'john@example.com' };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should parse and update req.body with valid data', () => {
    const schema = z.object({
      age: z.coerce.number(),
      name: z.string(),
    });

    mockReq.body = { age: '25', name: 'Alice' };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.body.age).toBe(25);
    expect(mockReq.body.name).toBe('Alice');
  });

  it('should call next on validation success', () => {
    const schema = z.object({
      id: z.number(),
    });

    mockReq.body = { id: 123 };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should pass AppError to next on validation failure', () => {
    const schema = z.object({
      email: z.string().email('Invalid email format'),
    });

    mockReq.body = { email: 'not-an-email' };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should include validation error message in AppError', () => {
    const schema = z.object({
      age: z.number().min(18, 'Must be at least 18'),
    });

    mockReq.body = { age: 15 };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    const error = (mockNext as jest.Mock).mock.calls[0][0] as AppError;
    expect(error.message).toContain('Validation error');
    expect(error.message).toContain('Must be at least 18');
    expect(error.statusCode).toBe(400);
  });

  it('should handle multiple validation errors', () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(18),
    });

    mockReq.body = { email: 'invalid', age: 10 };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    const error = (mockNext as jest.Mock).mock.calls[0][0] as AppError;
    expect(error.message).toContain('email');
    expect(error.message).toContain('age');
  });

  it('should validate nested objects', () => {
    const schema = z.object({
      user: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    });

    mockReq.body = {
      user: { name: 'John', email: 'john@example.com' },
    };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should reject invalid nested objects', () => {
    const schema = z.object({
      user: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    });

    mockReq.body = {
      user: { name: 'John', email: 'invalid-email' },
    };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should work with ZodEffects (refined schemas)', () => {
    const schema = z
      .object({
        password: z.string(),
        confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
      });

    mockReq.body = { password: 'pass123', confirmPassword: 'pass123' };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should reject ZodEffects that fail refinement', () => {
    const schema = z
      .object({
        password: z.string(),
        confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
      });

    mockReq.body = { password: 'pass123', confirmPassword: 'different' };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = (mockNext as jest.Mock).mock.calls[0][0] as AppError;
    expect(error.message).toContain('Passwords do not match');
  });

  it('should handle optional fields', () => {
    const schema = z.object({
      name: z.string(),
      phone: z.string().optional(),
    });

    mockReq.body = { name: 'John' };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should validate arrays', () => {
    const schema = z.object({
      tags: z.array(z.string()),
    });

    mockReq.body = { tags: ['tag1', 'tag2', 'tag3'] };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should reject invalid array items', () => {
    const schema = z.object({
      ids: z.array(z.number()),
    });

    mockReq.body = { ids: [1, 2, 'invalid'] };
    const middleware = validate(schema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
  });
});
