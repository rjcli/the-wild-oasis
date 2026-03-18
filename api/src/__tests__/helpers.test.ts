import { subtractDates, getToday, buildFileUrl } from '../utils/helpers';

describe('helpers', () => {
  describe('subtractDates', () => {
    it('should calculate the difference between two dates in days', () => {
      const result = subtractDates('2026-03-20', '2026-03-15');
      expect(result).toBe(5);
    });

    it('should return negative value when first date is before second date', () => {
      const result = subtractDates('2026-03-10', '2026-03-15');
      expect(result).toBe(-5);
    });

    it('should return 0 when dates are the same', () => {
      const result = subtractDates('2026-03-15', '2026-03-15');
      expect(result).toBe(0);
    });

    it('should handle ISO string dates correctly', () => {
      const result = subtractDates(
        '2026-03-20T00:00:00.000Z',
        '2026-03-15T00:00:00.000Z',
      );
      expect(result).toBe(5);
    });

    it('should work with different ISO formats', () => {
      const result = subtractDates('2026-03-25', '2026-03-20');
      expect(result).toBe(5);
    });
  });

  describe('getToday', () => {
    it('should return a valid ISO string for today', () => {
      const today = getToday();

      expect(typeof today).toBe('string');
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should set time to start of day by default (00:00:00)', () => {
      const today = getToday();
      const date = new Date(today);

      expect(date.getUTCHours()).toBe(0);
      expect(date.getUTCMinutes()).toBe(0);
      expect(date.getUTCSeconds()).toBe(0);
    });

    it('should set time to end of day when end option is true', () => {
      const today = getToday({ end: true });
      const date = new Date(today);

      expect(date.getUTCHours()).toBe(23);
      expect(date.getUTCMinutes()).toBe(59);
      expect(date.getUTCSeconds()).toBe(59);
      expect(date.getUTCMilliseconds()).toBe(999);
    });

    it('should return different values for start and end of day', () => {
      const startOfDay = getToday();
      const endOfDay = getToday({ end: true });

      expect(startOfDay).not.toEqual(endOfDay);
    });

    it('should return a valid date that can be parsed', () => {
      const today = getToday();
      const date = new Date(today);

      expect(date instanceof Date).toBe(true);
      expect(!isNaN(date.getTime())).toBe(true);
    });

    it('should return end time correctly for end of day', () => {
      const endOfDay = getToday({ end: true });
      const date = new Date(endOfDay);

      // Check the date part matches today
      const now = new Date();
      expect(date.getUTCFullYear()).toBe(now.getUTCFullYear());
      expect(date.getUTCMonth()).toBe(now.getUTCMonth());
      expect(date.getUTCDate()).toBe(now.getUTCDate());
    });
  });

  describe('buildFileUrl', () => {
    const baseUrl = 'http://api.example.com';

    it('should return null when filePath is null', () => {
      const result = buildFileUrl(baseUrl, null);
      expect(result).toBeNull();
    });

    it('should return null when filePath is undefined', () => {
      const result = buildFileUrl(baseUrl, undefined);
      expect(result).toBeNull();
    });

    it('should return null when filePath is empty string', () => {
      const result = buildFileUrl(baseUrl, '');
      expect(result).toBeNull();
    });

    it('should build a valid URL with baseUrl and filePath', () => {
      const result = buildFileUrl(baseUrl, 'uploads/cabins/image.jpg');
      expect(result).toBe('http://api.example.com/uploads/cabins/image.jpg');
    });

    it('should not prepend baseUrl to HTTP URLs', () => {
      const httpUrl = 'http://cdn.example.com/image.jpg';
      const result = buildFileUrl(baseUrl, httpUrl);
      expect(result).toBe(httpUrl);
    });

    it('should not prepend baseUrl to HTTPS URLs', () => {
      const httpsUrl = 'https://cdn.example.com/image.jpg';
      const result = buildFileUrl(baseUrl, httpsUrl);
      expect(result).toBe(httpsUrl);
    });

    it('should handle trailing slash in baseUrl', () => {
      const result = buildFileUrl(baseUrl + '/', 'uploads/avatars/avatar.jpg');
      expect(result).toBe('http://api.example.com//uploads/avatars/avatar.jpg');
    });

    it('should handle relative paths', () => {
      const result = buildFileUrl(baseUrl, 'public/uploads/image.jpg');
      expect(result).toBe('http://api.example.com/public/uploads/image.jpg');
    });

    it('should maintain file names with special characters', () => {
      const result = buildFileUrl(baseUrl, 'uploads/cabin-123-abc.jpeg');
      expect(result).toBe('http://api.example.com/uploads/cabin-123-abc.jpeg');
    });
  });
});
