import { JsonWebTokenError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import apiResponse from '../utils/apiResponse';

interface CustomError extends Error {
  status?: number;
}

// Bad Request error
class BadRequestError extends Error implements CustomError {
  status = 400;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

// Unauthorized error
class UnauthorizedError extends Error implements CustomError {
  status = 401;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// Forbidden error
class ForbiddenError extends Error implements CustomError {
  status = 403;

  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// Not found error
class NotFoundError extends Error implements CustomError {
  status = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Internal server error
class InternalServerError extends Error implements CustomError {
  status = 500;

  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
  }
}
const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof JsonWebTokenError) {
    return apiResponse.errorResponse(res, 403, 'Invalid token.');
  }
  if (error.status) {
    return apiResponse.errorResponse(res, error.status, error.message);
  } else {
    console.log(error);
    return apiResponse.errorResponse(res, 500, 'An unknown error occurred.');

  }
};

export {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  errorHandler,
};