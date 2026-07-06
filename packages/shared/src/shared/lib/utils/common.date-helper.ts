import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export type DateInput = string | number | Date | Dayjs | null | undefined;

export const normalizeDateFormat = (format: string): string =>
  format.replace(/yyyy/g, 'YYYY').replace(/yy/g, 'YY').replace(/dd/g, 'DD');

export const parseDateInput = (date: DateInput): Dayjs => {
  if (dayjs.isDayjs(date)) return date;

  if (typeof date === 'string') {
    const value = date.trim();

    if (/^\d{8}$/.test(value)) {
      return dayjs(value, 'YYYYMMDD', true);
    }

    if (/^\d{14}$/.test(value)) {
      return dayjs(value, 'YYYYMMDDHHmmss', true);
    }
  }

  return dayjs(date);
};
