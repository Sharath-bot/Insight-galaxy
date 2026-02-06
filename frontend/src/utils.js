import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes without style conflicts.
 * Essential for the 'isActive' logic in your Admin and Researcher sidebars.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}