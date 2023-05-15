import createHttpError from 'http-errors';
import MailTemplateModel from '../model/MailTemplateModel';

class MailTemplateService {
  static async addMailTemplate(payload: {
    name: string;
    subject: string;
    html: string;
  }) {
    let { name, subject, html } = payload;

    name = name.trim();

    const mailTemplateExists = await MailTemplateModel.findOne({ name });

    if (mailTemplateExists) {
      throw new createHttpError.BadRequest('Mail template already exists');
    }

    const mailTemplate = await MailTemplateModel.create({
      name,
      subject,
      html
    });

    return mailTemplate;
  }

  static async updateMailTemplate(payload: {
    mailTemplateId: string;
    name: string;
    subject: string;
    html: string;
  }) {
    let { name, subject, html, mailTemplateId } = payload;

    name = name.trim();

    const mailTemplateExists = await MailTemplateModel.findOne({
      _id: { $ne: mailTemplateId },
      name
    });

    if (mailTemplateExists) {
      throw new createHttpError.BadRequest(
        'Mail template already exists with this name'
      );
    }

    const mailTemplate = await MailTemplateModel.findByIdAndUpdate(
      mailTemplateId,
      {
        name,
        subject,
        html
      },
      { new: true }
    );

    if (!mailTemplate) {
      throw new createHttpError.BadRequest('Mail template not found');
    }

    return mailTemplate;
  }

  static async deleteMailTemplate(payload: { mailTemplateId: string }) {
    const { mailTemplateId } = payload;

    const mailTemplate = await MailTemplateModel.findByIdAndDelete(
      mailTemplateId
    );

    if (!mailTemplate) {
      throw new createHttpError.BadRequest('Mail template not found');
    }

    return mailTemplate;
  }

  static async getMailTemplateList() {
    const mailTemplates = await MailTemplateModel.find();

    return mailTemplates;
  }

  static async getMailTemplate(payload: { mailTemplateName: string }) {
    const { mailTemplateName } = payload;

    const mailTemplate = await MailTemplateModel.findOne({
      name: mailTemplateName
    });

    return mailTemplate;
  }
}

export default MailTemplateService;
