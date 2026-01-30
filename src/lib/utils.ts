import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export utility functions
export * from './utils/google-drive-image';
export * from './utils/drive-image';
export * from './utils/date-format';
export * from './utils/event-status';
export * from './utils/sanitize-html';