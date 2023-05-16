import { Router } from 'express';
import asyncFunction from 'express-async-handler';

import Auth from '../middleware/auth';
import MailController from '../controllers/mailController';

const mailRoutes = Router();

mailRoutes.post(
  '/sendMail',
  Auth.ensureAppAdmin,
  asyncFunction(MailController.sendMail)
);

mailRoutes.post(
  '/sendBulkMails',
  Auth.ensureAppAdmin,
  asyncFunction(MailController.sendBulkMails)
);

export default mailRoutes;
