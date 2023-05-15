import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export default class HealthCheckController {
  static async healthCheck(req: Request, res: Response) {
    // This controller will be used to check the health of the application
    return res.send({
      mongodb:
        mongoose.connection.readyState === 1 ? 'connected' : 'not connected'
    });
  }
}
