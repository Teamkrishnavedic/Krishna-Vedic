import { AppError } from '../middleware/errorHandler';

/**
 * Normalizes and validates an Express route parameter.
 * Handles both Express 4 (string) and Express 5 (string | string[]) parameter types safely.
 * Returns a clean trimmed string or throws a 400 Bad Request error if missing/invalid.
 */
export function getRouteParam(value: string | string[] | undefined, paramName = 'id'): string {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) return trimmed;
  } else if (Array.isArray(value) && value.length > 0) {
    const first = value[0];
    if (typeof first === 'string' && first.trim().length > 0) {
      return first.trim();
    }
  }
  throw new AppError(400, `Missing or invalid parameter: ${paramName}`);
}

