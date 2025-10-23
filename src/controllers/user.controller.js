import UserService from '../services/user.service.js';

export default class UserController {
  static async setHelpRadius(req, res, next) {
    try {
      const { helpRadius } = req.body;
      const user = await UserService.setHelpRadius(req.user.id, helpRadius);
      res.json({
        success: true,
        message: 'Help radius updated successfully',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateUserLocation(req, res, next) {
    try {
      const { lat, lng } = req.body;
      const user = await UserService.updateUserLocation(req.user.id, lat, lng);
      res.json({
        success: true,
        message: 'Location updated successfully',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}
