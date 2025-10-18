import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

export const userRouter = Router();

userRouter.get('/', UserController.getAllUsers);


