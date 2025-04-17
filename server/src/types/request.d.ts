import { Request } from 'express';
import { UserPayload } from '../helpers/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
