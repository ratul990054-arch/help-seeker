
import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/signup', AuthController.signup);
authRouter.post('/verify-otp', AuthController.verifyOtp);
authRouter.post('/login', AuthController.login);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/reset-password', AuthController.resetPassword);



