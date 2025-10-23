import { Router } from 'express';
import HelpController from '../controllers/help.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import { askHelpSchema } from '../schemas/help.schema.js';

export const helpRouter = Router();

helpRouter.post('/ask', authMiddleware, validationMiddleware(askHelpSchema), HelpController.askHelp);
