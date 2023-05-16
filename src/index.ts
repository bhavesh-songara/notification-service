import app from './app';
import connectToMongodb from './connectors/mongodb';
import { connectToRedis } from './connectors/redis';
import logger from './utils/logger';
import validateEnv from './utils/validateEnv';
import { mailWorker } from './workers/mailWorker';

async function bootstrap() {
  const SERVICE_PORT = process.env.SERVICE_PORT;

  try {
    await connectToMongodb();

    await connectToRedis();

    validateEnv();

    app.listen(SERVICE_PORT, () => {
      logger.info(`HTTP server running on port: ${SERVICE_PORT}`);
    });

    mailWorker.run();
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
