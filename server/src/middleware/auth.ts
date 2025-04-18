import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../views/error";
import { UserPayload, verifyToken } from "../helpers/jwt";
import { JwtPayload } from "jsonwebtoken";

interface IUserPayload extends JwtPayload, UserPayload {
  
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError("Token is required");
    }

    const isBearer = authHeader.startsWith("Bearer ");
    if (!isBearer) {
      throw new UnauthorizedError("Token is invalid");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Token is required");
    }

    const user = verifyToken(token);
    req.user = user as IUserPayload;
    next();
  } catch (e) {
    next(e);
  }
}

export const leadOnly = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUserPayload;
    if (user.role !== "lead") {
      throw new ForbiddenError("Only user with role lead can access this route");
    }
    next();
  } catch (e) {
    next(e);
  }
}