import createHttpError from 'http-errors';
import { NextFunction, Request, Response } from 'express';

class Auth {
  static ensureAppAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.headers['x-app-secret']) {
        throw new createHttpError.Unauthorized('App secret is required');
      }

      if (req.headers['x-app-secret'] !== process.env.APP_SECRET) {
        throw new createHttpError.Unauthorized('Invalid app secret');
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

export default Auth;
