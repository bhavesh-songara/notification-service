import { Router } from 'express';
import asyncFunction from 'express-async-handler';

import MailTemplateController from '../controllers/mailTemplateController';
import Auth from '../middleware/auth';

const mailTemplateRoutes = Router();

mailTemplateRoutes.post(
  '/addMailTemplate',
  Auth.ensureAppAdmin,
  asyncFunction(MailTemplateController.addMailTemplate)
);
mailTemplateRoutes.put(
  '/updateMailTemplate',
  Auth.ensureAppAdmin,
  asyncFunction(MailTemplateController.updateMailTemplate)
);
mailTemplateRoutes.delete(
  '/deleteMailTemplate',
  Auth.ensureAppAdmin,
  asyncFunction(MailTemplateController.deleteMailTemplate)
);
mailTemplateRoutes.get(
  '/getMailTemplateList',
  Auth.ensureAppAdmin,
  asyncFunction(MailTemplateController.getMailTemplateList)
);
mailTemplateRoutes.get(
  '/getMailTemplate',
  Auth.ensureAppAdmin,
  asyncFunction(MailTemplateController.getMailTemplate)
);

export default mailTemplateRoutes;
