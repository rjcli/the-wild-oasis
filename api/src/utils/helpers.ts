import { differenceInDays, parseISO } from 'date-fns';

export const subtractDates = (dateStr1: string, dateStr2: string): number =>
  differenceInDays(parseISO(dateStr1), parseISO(dateStr2));

/** Returns today's ISO string. If end=true, set to end of day (23:59:59.999). */
export const getToday = (options: { end?: boolean } = {}): string => {
  const today = new Date();
  if (options.end) today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

/** Build a fully-qualified URL for a stored file (e.g. uploads/cabins/foo.jpg). */
export const buildFileUrl = (
  baseUrl: string,
  filePath: string | null | undefined,
): string | null => {
  if (!filePath) return null;
  if (filePath.startsWith('http://') || filePath.startsWith('https://'))
    return filePath;
  return `${baseUrl}/${filePath}`;
};
