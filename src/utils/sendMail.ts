import * as nodemailer from 'nodemailer';
import logger from './logger';

interface SendMailInterface {
  from: string;
  to: string;
  subject: string;
  html: string | undefined;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const sendMail = async (payload: SendMailInterface) => {
  try {
    let { from, to, subject, html } = payload;

    await transporter.sendMail(
      {
        from,
        to,
        subject,
        html
      },
      (error, info) => {
        if (error) {
          throw new Error(`
            NodeMailer: Error sending email: ${error}
          `);
        } else {
          logger.info(`Email sent: ${info.response}`);
        }
      }
    );
  } catch (err) {
    throw new Error(`
      NodeMailer: Error sending email: ${err}
    `);
  }
};

export default sendMail;
