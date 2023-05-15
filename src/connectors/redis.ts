import IORedis from 'ioredis';

import logger from '../utils/logger';

export let redisClient: IORedis;

export async function connect() {
  redisClient = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD
  });

  redisClient.on('error', (error: Error) => {
    logger.error(`Error in connecting with Redis`, error);
  });

  redisClient.on('connect', () => {
    logger.info(`Connected with Redis`);
  });
}
