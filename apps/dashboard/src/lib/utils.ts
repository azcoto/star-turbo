import { type ClassValue, clsx } from 'clsx';
import { formatDuration, intervalToDuration } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function humanDuration(time: number) {
  return formatDuration(intervalToDuration({ start: 0, end: time * 1000 }));
}
