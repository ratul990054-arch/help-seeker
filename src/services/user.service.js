import UserRepository from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';

export default class UserService {
  static async setHelpRadius(userId, helpRadius) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.helpRadius = helpRadius;
    await user.save();
    return user;
  }

  static async updateUserLocation(userId, lat, lng) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.location = { type: 'Point', coordinates: [lng, lat] };
    await user.save();
    return user;
  }
}
