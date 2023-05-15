import { Request, Response } from 'express';
import Joi from 'joi';
import createHttpError from 'http-errors';
import validateJoiSchema from '../utils/validateJoiSchema';
import MailTemplateService from '../services/mailTemplateService';

class MailTemplateController {
  static async addMailTemplate(req: Request, res: Response) {
    const { name, subject, html } = req.body;

    validateJoiSchema({
      schema: Joi.object({
        name: Joi.string().required(),
        subject: Joi.string().required(),
        html: Joi.string().required()
      }),
      data: req.body
    });

    const mailTemplate = await MailTemplateService.addMailTemplate({
      name,
      subject,
      html
    });

    res.send(mailTemplate);
  }

  static async updateMailTemplate(req: Request, res: Response) {
    const { name, subject, html } = req.body;
    const { mailTemplateId } = req.query;

    validateJoiSchema({
      schema: Joi.object({
        mailTemplateId: Joi.string().hex().length(24).required(),
        name: Joi.string().required(),
        subject: Joi.string().required(),
        html: Joi.string().required()
      }),

      data: {
        name,
        subject,
        html,
        mailTemplateId
      }
    });

    const updatedMailTemplate = await MailTemplateService.updateMailTemplate({
      mailTemplateId: mailTemplateId as string,
      name,
      subject,
      html
    });

    res.send(updatedMailTemplate);
  }

  static async deleteMailTemplate(req: Request, res: Response) {
    const { mailTemplateId } = req.query;

    validateJoiSchema({
      schema: Joi.object({
        mailTemplateId: Joi.string().hex().length(24).required()
      }),
      data: {
        mailTemplateId
      }
    });

    await MailTemplateService.deleteMailTemplate({
      mailTemplateId: mailTemplateId as string
    });

    res.send({
      message: 'Mail Template Deleted Successfully'
    });
  }

  static async getMailTemplateList(req: Request, res: Response) {
    const mailTemplateList = await MailTemplateService.getMailTemplateList();

    res.send(mailTemplateList);
  }

  static async getMailTemplate(req: Request, res: Response) {
    const { mailTemplateName } = req.query;

    validateJoiSchema({
      schema: Joi.object({
        mailTemplateName: Joi.string().required()
      }),
      data: {
        mailTemplateName
      }
    });

    const mailTemplate = await MailTemplateService.getMailTemplate({
      mailTemplateName: mailTemplateName as string
    });

    if (!mailTemplate) {
      throw new createHttpError.BadRequest('Mail Template not found');
    }

    res.send(mailTemplate);
  }
}

export default MailTemplateController;
