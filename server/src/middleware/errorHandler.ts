import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (res.headersSent) {
    return _next(err);
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  // Database connection exhaustion or pool timeout
  if (
    err.name === 'PrismaClientInitializationError' ||
    err.message?.includes('Too many database connections') ||
    err.message?.includes('remaining connection slots are reserved')
  ) {
    console.error('⚠️ Database connection capacity reached:', err.message);
    res.setHeader('Retry-After', '2');
    res.status(503).json({
      error: 'Database is momentarily busy. Please try again shortly.',
      code: 'DB_BUSY',
    });
    return;
  }

  // Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      res.status(409).json({ error: 'A record with that value already exists.' });
      return;
    }
    if (prismaErr.code === 'P2025') {
      res.status(404).json({ error: 'Record not found.' });
      return;
    }
  }

  // Zod validation errors
  if (err.constructor.name === 'ZodError') {
    res.status(422).json({ error: 'Validation failed', details: (err as any).errors });
    return;
  }

  // Default
  console.error('[Error]', err);
  const errorMessage = err.message || 'Internal server error';
  res.status(500).json({
    error: errorMessage,
    message: errorMessage,
  });
}
