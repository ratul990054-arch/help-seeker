
import UserRepository from '../repositories/user.repository.js';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

export default class UserService {
  static async getAllUsers() {
    return await UserRepository.findAll();
  }

  static async updateUserLocation(userId, { lat, lng }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.location = {
      type: 'Point',
      coordinates: [lng, lat],
    };

    await user.save();

    return user;
  }
}

