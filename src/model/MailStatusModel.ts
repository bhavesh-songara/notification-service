import mongoose from 'mongoose';

export enum MailStatusEnum {
  Pending = 'Pending',
  Sent = 'Sent',
  Failed = 'Failed'
}

interface IMailStatus {
  mailTemplateName: string;
  sender: string;
  recipient: string;
  sentAt?: Date;
  status: MailStatusEnum;
  error?: string;
  metaData?: Record<string, any>;
}

interface IMailStatusDocument extends IMailStatus, mongoose.Document {}

const mailStatusSchema = new mongoose.Schema(
  {
    mailTemplateName: {
      type: String,
      require: true
    },
    sender: {
      type: String,
      require: true
    },
    recipient: {
      type: String,
      require: true
    },
    sentAt: {
      type: Date
    },
    status: {
      type: String,
      enum: Object.values(MailStatusEnum),
      default: MailStatusEnum.Pending
    },
    error: {
      type: String
    },
    metaData: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true,
    collection: 'MailStatus'
  }
);

const MailStatusModel = mongoose.model<IMailStatusDocument>(
  'MailStatus',
  mailStatusSchema
);

export default MailStatusModel;
