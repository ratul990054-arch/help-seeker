import UserRepository from '../repositories/user.repository.js';

export default class UserService {
  static async getAllUsers() {
    return await UserRepository.findAll();
  }
}
