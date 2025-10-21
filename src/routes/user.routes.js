
import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import { getAllUsersSchema, updateUserLocationSchema } from '../schemas/user.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const userRouter = Router();

userRouter.get('/', authMiddleware, validationMiddleware(getAllUsersSchema), UserController.getAllUsers);
userRouter.patch('/location', authMiddleware, validationMiddleware(updateUserLocationSchema), UserController.updateUserLocation);



