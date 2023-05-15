import app from './app';
import * as mongodb from './connectors/mongodb';
import logger from './utils/logger';
import * as redis from './connectors/redis';

async function bootstrap() {
  const SERVICE_PORT = process.env.SERVICE_PORT;

  try {
    // await mongodb.connect();
    // await redis.connect();
    app.listen(SERVICE_PORT, () => {
      logger.info(`HTTP server running on port: ${SERVICE_PORT}`);
    });
  } catch (err) {
    logger.error('Error in starting server', err);
    process.exit(1);
  }
}

process.on('uncaughtException', function (err: Error) {
  logger.error('uncaughtException', err);
});

process.on('unhandledRejection', function (err: Error) {
  logger.error('unhandledRejection', err);
});

bootstrap();
