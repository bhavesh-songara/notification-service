import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from '../utils/logger';

export default class ErrorHandler {
  static notFoundHandler(req: Request, res: Response) {
    return res.status(404).json({
      message: 'Resource not found'
    });
  }

  static getErrorHandler() {
    return function (
      err: Error,
      req: Request,
      res: Response,
      _next: NextFunction
    ) {
      logger.error('errorHandler', err);

      if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
          message: err.message
        });
      }

      return res.status(500).json({
        message: 'Internal Server Error'
      });
    };
  }
}
