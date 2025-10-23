import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import { setHelpRadiusSchema, updateLocationSchema } from '../schemas/user.schema.js';

export const userRouter = Router();

userRouter.put('/set-distance', authMiddleware, validationMiddleware(setHelpRadiusSchema), UserController.setHelpRadius);
userRouter.post('/update-location', authMiddleware, validationMiddleware(updateLocationSchema), UserController.updateUserLocation);
