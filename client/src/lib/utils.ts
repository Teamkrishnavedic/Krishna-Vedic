import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format paise to Indian rupee string */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

/** Slugify a string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Truncate string */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + '…';
}

/** Get discount percentage */
export function discountPercent(price: number, compareAt: number): number {
  if (compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** Format date */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/** Format datetime */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/** Order status color */
export function orderStatusClass(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'status-pending',
    CONFIRMED: 'status-confirmed',
    PROCESSING: 'status-processing',
    PACKED: 'status-packed',
    SHIPPED: 'status-shipped',
    DELIVERED: 'status-delivered',
    CANCELLED: 'status-cancelled',
    RETURNED: 'status-returned',
  };
  return map[status] || 'badge-gray';
}

export const orderStatusColor = orderStatusClass;

/** Payment status label */
export function paymentStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'Pending',
    PAID: 'Paid',
    FAILED: 'Failed',
    REFUNDED: 'Refunded',
    PARTIALLY_REFUNDED: 'Partially Refunded',
  };
  return map[status] || status;
}
