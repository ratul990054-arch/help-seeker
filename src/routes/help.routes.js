
import { Router } from 'express';
import HelpController from '../controllers/help.controller.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import { createHelpRequestSchema, respondToHelpRequestSchema } from '../schemas/help.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const helpRouter = Router();

helpRouter.post('/request', authMiddleware, validationMiddleware(createHelpRequestSchema), HelpController.createHelpRequest);
helpRouter.patch('/respond', authMiddleware, validationMiddleware(respondToHelpRequestSchema), HelpController.respondToHelpRequest);
helpRouter.patch('/complete/:id', authMiddleware, HelpController.completeHelpRequest);
