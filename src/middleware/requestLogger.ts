import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const getRequestLogger = () => {
  return function (req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();

    res.on('finish', () => {
      const endedAt = Date.now();
      const responseTime = endedAt - startedAt;

      if (!req.originalUrl.match('healthcheck')) {
        logger.http(`${req.method} ${req.originalUrl}`, {
          responseTime,
          statusCode: res.statusCode
        });
      }
    });

    next();
  };
};

export default getRequestLogger;
