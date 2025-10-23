import HelpService from '../services/help.service.js';

export default class HelpController {
  static async askHelp(req, res, next) {
    try {
      const { latitude, longitude } = req.body;
      const { helpRequest, notifiedUsers } = await HelpService.askHelp(req.user.id, latitude, longitude);
      res.json({
        success: true,
        message: 'Help request created and nearby users notified',
        data: {
          requestId: helpRequest._id,
          notifiedUsers,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
