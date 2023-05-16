import { Request, Response } from 'express';
import MailService from '../services/mailService';
import validateJoiSchema from '../utils/validateJoiSchema';
import Joi from 'joi';
import { MailPriorityEnum } from '../connectors/mailQueue';

class MailController {
  static async sendMail(req: Request, res: Response) {
    const { data, priority } = req.body;

    validateJoiSchema({
      schema: Joi.object({
        data: Joi.object({
          to: Joi.string().email().required(),
          sender: Joi.string().email().required(),
          templateName: Joi.string().required(),
          metaData: Joi.object()
        }).required(),
        priority: Joi.number()
          .valid(...Object.values(MailPriorityEnum))
          .required()
      }),
      data: {
        data,
        priority
      }
    });

    await MailService.sendMail({
      data,
      priority
    });

    res.send('Mail sent successfully');
  }

  static async sendBulkMails(req: Request, res: Response) {
    const { data, priority } = req.body;

    validateJoiSchema({
      schema: Joi.object({
        data: Joi.array()
          .items(
            Joi.object({
              to: Joi.string().email().required(),
              sender: Joi.string().email().required(),
              templateName: Joi.string().required(),
              metaData: Joi.object()
            }).required()
          )
          .required(),
        priority: Joi.number()
          .valid(...Object.values(MailPriorityEnum))
          .required()
      }),
      data: {
        data,
        priority
      }
    });

    await MailService.sendBulkMails({
      data,
      priority
    });

    res.send('Bulk mails sent successfully');
  }
}

export default MailController;
