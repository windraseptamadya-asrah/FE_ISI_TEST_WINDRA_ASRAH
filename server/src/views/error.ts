import { Request, Response, NextFunction } from "express";
import { generateResponse } from "../entities/response";
import { QueryFailedError } from "typeorm";

/**
 * Throws 400 error to client
 */
export class BadRequestError extends Error {
  constructor(message = "Bad request") {
    super(message);
    this.name = "BadRequestError";
  }
}

/**
 * Throws 401 error to client
 */
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Throws 403 error to client
 */
export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Throws 404 error to client
 */
export class NotFoundError extends Error {
  constructor(message = "Entity not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = 500;

  if (err.name === "BadRequestError") {
    status = 400;
  } else if (
    err.name === "UnauthorizedError" ||
    err.name === "JsonWebTokenError"
  ) {
    status = 401;
  } else if (err.name === "ForbiddenError") {
    status = 403;
  } else if (err.name === "NotFoundError") {
    status = 404;
  } else if (err instanceof QueryFailedError) {
    const driverError = err.driverError;
    if (driverError && driverError.code === "23505") {
      status = 409;
      err.message = "Data already exists";
    }
  } else {
    console.error(err);
  }

  generateResponse(res, null, status, err.message);
}
