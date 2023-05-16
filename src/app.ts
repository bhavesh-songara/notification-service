import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';

import getRequestLogger from './middleware/requestLogger';
import HealthCheckController from './controllers/healthCheckController';
import apiRouter from './routes';
import ErrorHandler from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This will log all incoming requests
app.use(getRequestLogger());

app.use('/healthcheck', HealthCheckController.healthCheck);
app.use('/api', apiRouter);

// This will send a 404 error if any route is not found
app.use('*', ErrorHandler.notFoundHandler);
// This will handle all errors
app.use(ErrorHandler.getErrorHandler());

export default app;
