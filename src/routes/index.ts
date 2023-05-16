import { Router } from 'express';

import mailTemplateRoutes from './mailTemplateRoutes';
import mailRoutes from './mailRoutes';

const apiRouter = Router();

apiRouter.use('/mailTemplate', mailTemplateRoutes);
apiRouter.use('/mail', mailRoutes);

export default apiRouter;
