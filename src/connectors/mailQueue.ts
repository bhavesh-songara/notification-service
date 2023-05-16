import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import logger from '../utils/logger';
import GLOBAL_CONSTANTS from '../constants/globalConstants';
import MailStatusModel from '../model/MailStatusModel';
import { getRedisClient } from './redis';

export interface MailQueuePayload {
  to: string;
  sender: string;
  templateName: string;
  metaData?: Record<string, any>;
}

export enum MailPriorityEnum {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3
}

class MailQueue {
  private redisClient?: IORedis;
  private mailQueue?: Queue;
  private isConnected = false;

  public async connect() {
    this.redisClient = getRedisClient();
    this.mailQueue = new Queue(GLOBAL_CONSTANTS.MAIL_QUEUE_NAME, {
      connection: this.redisClient
    });
    this.isConnected = true;
  }

  public async sendMail(payload: {
    data: MailQueuePayload;
    priority: MailPriorityEnum;
  }): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Mail Queue: Not connected to redis');
    }

    const { data, priority } = payload;

    const mailStatusDoc = await MailStatusModel.create({
      mailTemplateName: data.templateName,
      sender: data.sender,
      recipient: data.to,
      metaData: data.metaData
    });

    const jobId = mailStatusDoc._id.toString();

    await this.mailQueue?.add(jobId, data, {
      priority,
      removeOnComplete: true,
      removeOnFail: true,
      jobId
    });

    logger.info(
      `Mail Queue: Added in mail queue with jobId: ${jobId} and priority: ${priority}`
    );
  }

  public async sendBulkMails(payload: {
    data: MailQueuePayload[];
    priority: MailPriorityEnum;
  }): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Mail Queue: Not connected to redis');
    }

    const { data, priority } = payload;

    const insertOperations = data.map((item) => {
      return {
        mailTemplateName: item.templateName,
        sender: item.sender,
        recipient: item.to,
        metaData: item.metaData
      };
    });

    const result = await MailStatusModel.insertMany(insertOperations, {
      ordered: true
    });

    const tasks = result.map((item) => {
      const jobId = item._id.toString();

      return {
        name: jobId,
        data: {
          templateName: item.mailTemplateName,
          sender: item.sender,
          to: item.recipient,
          metaData: item.metaData
        },
        options: {
          priority,
          removeOnComplete: true,
          removeOnFail: true,
          jobId
        }
      };
    });

    await this.mailQueue?.addBulk(tasks);
    logger.info(
      `Mail Queue: Added in mail queue with priority: ${priority} and total mails: ${tasks.length}`
    );
  }
}

export default MailQueue;
