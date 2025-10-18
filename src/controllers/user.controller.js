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
}
