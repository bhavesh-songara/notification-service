import MailQueue, { MailPriorityEnum } from '../connectors/mailQueue';
import { MailQueuePayload } from '../connectors/mailQueue';

const mailQueue = new MailQueue();

class MailService {
  static async sendMail(payload: {
    data: MailQueuePayload;
    priority: MailPriorityEnum;
  }) {
    const { data, priority } = payload;

    await mailQueue.connect();

    await mailQueue.sendMail({
      data,
      priority
    });
  }

  static async sendBulkMails(payload: {
    data: MailQueuePayload[];
    priority: MailPriorityEnum;
  }) {
    const { data, priority } = payload;

    await mailQueue.connect();

    await mailQueue.sendBulkMails({
      data,
      priority
    });
  }
}

export default MailService;
