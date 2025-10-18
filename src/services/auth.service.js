
import UserRepository from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

export default class AuthService {
  static async signup({ fullname, email, phonenumber, password, role }) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const user = await UserRepository.create({ fullname, email, phonenumber, password, role });

    const { otp, otpExpires } = user.generateOtp();
    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpires = otpExpires;
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        message: `Your email verification OTP is: ${otp}`,
      });
      return 'Verification OTP sent to email';
    } catch (error) {
      console.log(error)
      user.emailVerificationOtp = undefined;
      user.emailVerificationOtpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError('There was an error sending the verification email. Please try again later.', 500);
    }
  }

  static async verifyOtp(email, otp) {
    const user = await UserRepository.findByEmail(email, '+emailVerificationOtp +emailVerificationOtpExpires');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.emailVerificationOtp !== String(otp) || user.emailVerificationOtpExpires < Date.now()) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const accessToken = user.getJwtToken();
    const refreshToken = user.getRefreshToken();

    return { accessToken, refreshToken };
  }

  static async login(email, password) {
    const user = await UserRepository.findUserWithPasswordByEmail(email);

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isEmailVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    const accessToken = user.getJwtToken();
    const refreshToken = user.getRefreshToken();

    return { accessToken, refreshToken };
  }

  static async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { otp, otpExpires } = user.generateOtp();
    user.passwordResetOtp = otp;
    user.passwordResetOtpExpires = otpExpires;
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset',
        message: `Your password reset OTP is: ${otp}`,
      });
      return 'Password reset OTP sent to email';
    } catch (error) {
      user.passwordResetOtp = undefined;
      user.passwordResetOtpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError('There was an error sending the password reset email. Please try again later.', 500);
    }
  }

  static async resetPassword(email, otp, password) {
    const user = await UserRepository.findByEmail(email, '+passwordResetOtp +passwordResetOtpExpires');

    console.log('User:', user);
    console.log('Provided OTP:', otp);
    console.log('OTP Expires:', user ? user.passwordResetOtpExpires : 'No user found');
    console.log('Current Time:', new Date(Date.now()));

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.passwordResetOtp !== String(otp) || user.passwordResetOtpExpires < Date.now()) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    user.password = password;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpires = undefined;
    await user.save();

    return 'Password reset successful';
  }
}
