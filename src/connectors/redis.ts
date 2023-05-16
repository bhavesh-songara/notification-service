import IORedis from 'ioredis';
import logger from '../utils/logger';

let redisClient: IORedis;

export const connectToRedis = async () => {
  logger.info('Connecting to redis');

  if (!redisClient) {
    redisClient = new IORedis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD || undefined
    });

    redisClient.on('connect', () => {
      logger.info('Connected to redis');
    });

    redisClient.on('error', (err) => {
      redisClient.disconnect();
    });
  }

  // Check if redis is connected
  try {
    await redisClient.ping();
  } catch (err) {
    redisClient.disconnect();
    throw new Error('Error in connecting to redis');
  }

  return redisClient;
};

export const getRedisClient = () => {
  return redisClient;
};
