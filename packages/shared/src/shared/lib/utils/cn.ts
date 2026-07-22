import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return clsx(inputs);
}
