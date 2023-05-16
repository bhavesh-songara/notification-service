import { Worker } from 'bullmq';
import IORedis from 'ioredis';

import GLOBAL_CONSTANTS from '../constants/globalConstants';
import MailTemplateService from '../services/mailTemplateService';
import logger from '../utils/logger';
import mergeDataInHTML from '../utils/mergeDataInHTML';
import sendMail from '../utils/sendMail';
import { MailQueuePayload } from '../connectors/mailQueue';
import MailStatusModel, { MailStatusEnum } from '../model/MailStatusModel';
import { getRedisClient } from '../connectors/redis';

const redisClient = getRedisClient();

export const mailWorker = new Worker(
  GLOBAL_CONSTANTS.MAIL_QUEUE_NAME,
  async (job) => {
    try {
      logger.info(`Mail worker: Starting job id ${job.id}`);

      const { data } = job as { data: MailQueuePayload };

      logger.debug(`Mail worker: Job data ${JSON.stringify(data)}`);

      const template = await MailTemplateService.getMailTemplate({
        mailTemplateName: data.templateName
      });

      if (!template) {
        logger.error(
          `Mail Worker: Mail template not found for job id ${job.id}`
        );

        await MailStatusModel.findOneAndUpdate(
          {
            _id: job.id
          },
          {
            status: MailStatusEnum.Failed,
            error: 'Mail template not found'
          }
        );

        return;
      }

      const { html, error } = mergeDataInHTML(
        template.html,
        data.metaData || {}
      );

      if (error) {
        logger.error(
          `Mail Worker: Error merging data in html for job id ${job.id}, error: ${error}`
        );
        return;
      }

      const mailOptions = {
        from: data.sender,
        to: data.to,
        subject: template.subject,
        html
      };

      await sendMail(mailOptions);

      await MailStatusModel.findOneAndUpdate(
        {
          _id: job.id
        },
        {
          status: MailStatusEnum.Sent,
          sentAt: new Date()
        }
      );

      logger.info(`Mail worker: Finished job id ${job.id}`);
    } catch (error: any) {
      await MailStatusModel.findOneAndUpdate(
        {
          _id: job.id
        },
        {
          status: MailStatusEnum.Failed,
          error: error.message
        }
      );

      logger.error(
        `Mail worker: Error processing job id ${job.id}, error: ${error}`
      );
    }
  },
  {
    autorun: false,
    connection: redisClient,
    limiter: {
      max: 10,
      duration: 1000
    }
  }
);
