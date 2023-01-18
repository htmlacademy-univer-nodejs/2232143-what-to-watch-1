import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jose from 'jose';
import HttpError from '../common/errors/http-error.js';
import { MiddlewareInterface } from '../types/middleware.interface.js';

export class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) { }

  async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(this.jwtSecret));

      if (!payload.email || !payload.id) {
        return next(new HttpError(
          StatusCodes.BAD_REQUEST,
          'Email and id is required',
          'AuthenticateMiddleware')
        );
      }

      req.user = { email: `${payload.email}`, id: `${payload.id}` };
      return next();
    } catch {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}
