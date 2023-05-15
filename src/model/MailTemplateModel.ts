import mongoose from 'mongoose';

interface IMailTemplate {
  name: string;
  subject: string;
  html: string;
}

interface IMailTemplateDocument extends IMailTemplate, mongoose.Document {}

const mailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true
    },
    subject: {
      type: String,
      require: true
    },
    html: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true,
    collection: 'MailTemplates'
  }
);

const MailTemplateModel = mongoose.model<IMailTemplateDocument>(
  'MailTemplate',
  mailTemplateSchema
);

export default MailTemplateModel;
