import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

// Extend Express Request to include session user
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userRole?: string;
    cartId?: string;
    guestId?: string;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    throw new AppError(401, 'Authentication required');
  }
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    throw new AppError(401, 'Authentication required');
  }
  const role = req.session.userRole;
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    throw new AppError(403, 'Admin access required');
  }
  next();
}

export function requireStaff(req: Request, _res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    throw new AppError(401, 'Authentication required');
  }
  const role = req.session.userRole;
  if (!['STAFF', 'ADMIN', 'SUPER_ADMIN'].includes(role || '')) {
    throw new AppError(403, 'Staff access required');
  }
  next();
}

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    throw new AppError(401, 'Authentication required');
  }
  if (req.session.userRole !== 'SUPER_ADMIN') {
    throw new AppError(403, 'Super admin access required');
  }
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  // Allow unauthenticated — session data used if present
  next();
}
