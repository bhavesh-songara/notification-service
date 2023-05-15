import { Router } from 'express';

import mailTemplateRoutes from './mailTemplateRoutes';

const apiRouter = Router();

apiRouter.use('/mailTemplate', mailTemplateRoutes);

export default apiRouter;
