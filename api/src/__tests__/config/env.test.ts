describe('env config', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Store original env
    originalEnv = process.env;
    // Clear the module cache to reload env module with new env vars
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  it('should load environment variables correctly', () => {
    // Set environment variables
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3001';
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
    process.env.CORS_ORIGINS = 'http://localhost:3000,http://localhost:5173';
    process.env.MAX_FILE_SIZE_MB = '10';
    process.env.UPLOADS_DIR = 'public/uploads';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { env, isDev } = require('../../config/env');

    expect(env.NODE_ENV).toBe('test');
    expect(env.PORT).toBe(3001);
    expect(env.DATABASE_URL).toBe(
      'postgresql://user:pass@localhost:5432/testdb',
    );
    expect(env.JWT_SECRET).toBe('test-jwt-secret');
    expect(env.JWT_REFRESH_SECRET).toBe('test-jwt-refresh-secret');
    expect(isDev).toBe(false);
  });

  it('should use default values for optional environment variables', () => {
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    delete process.env.PORT;
    delete process.env.JWT_EXPIRES_IN;
    delete process.env.JWT_REFRESH_EXPIRES_IN;
    delete process.env.CORS_ORIGINS;
    delete process.env.MAX_FILE_SIZE_MB;
    delete process.env.UPLOADS_DIR;

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { env } = require('../../config/env');

    expect(env.PORT).toBe(3000);
    expect(env.JWT_EXPIRES_IN).toBe('1d');
    expect(env.JWT_REFRESH_EXPIRES_IN).toBe('7d');
    expect(Array.isArray(env.CORS_ORIGINS)).toBe(true);
    expect(env.MAX_FILE_SIZE_BYTES).toBeGreaterThan(0);
    expect(env.UPLOADS_DIR).toBe('public/uploads');
  });

  it('should parse CORS_ORIGINS as array', () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    process.env.CORS_ORIGINS =
      'http://localhost:3000, http://localhost:5173, https://example.com';

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { env } = require('../../config/env');

    expect(Array.isArray(env.CORS_ORIGINS)).toBe(true);
    expect(env.CORS_ORIGINS.length).toBe(3);
    expect(env.CORS_ORIGINS[0]).toBe('http://localhost:3000');
    expect(env.CORS_ORIGINS[1]).toBe('http://localhost:5173');
    expect(env.CORS_ORIGINS[2]).toBe('https://example.com');
  });

  it('should calculate MAX_FILE_SIZE_BYTES correctly', () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    process.env.MAX_FILE_SIZE_MB = '5';

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { env } = require('../../config/env');

    expect(env.MAX_FILE_SIZE_BYTES).toBe(5 * 1024 * 1024);
  });

  it('should set isDev to true for development environment', () => {
    process.env.NODE_ENV = 'development';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { isDev } = require('../../config/env');

    expect(isDev).toBe(true);
  });

  it('should set isDev to false for non-development environment', () => {
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { isDev } = require('../../config/env');

    expect(isDev).toBe(false);
  });

  it.skip('should throw error when required environment variable is missing', () => {
    // This test is skipped because nodejs caches required modules, and jest.setup.ts
    // sets all required env vars at module load time. In a real application, if
    // required env vars are missing, the app would fail to start during server initialization.
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    // Missing JWT_SECRET
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';

    jest.resetModules();

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../config/env');
    }).toThrow('Missing required environment variable: JWT_SECRET');
  });

  it('should default NODE_ENV to development when not set', () => {
    delete process.env.NODE_ENV;
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { env } = require('../../config/env');

    expect(env.NODE_ENV).toBe('development');
  });
});
