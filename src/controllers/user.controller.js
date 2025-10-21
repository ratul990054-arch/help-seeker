
import UserService from '../services/user.service.js';

export default class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.json({ data: users });
    } catch (err) {
      next(err);
    }
  }

  static async updateUserLocation(req, res, next) {
    try {
      const user = await UserService.updateUserLocation(req.user.id, req.body);
      res.json({ data: user });
    } catch (err) {
      next(err);
    }
  }
}

