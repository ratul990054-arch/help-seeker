
import HelpService from '../services/help.service.js';

export default class HelpController {
  static async createHelpRequest(req, res, next) {
    try {
      const helpRequest = await HelpService.createHelpRequest(req.user.id, req.body);
      res.status(201).json({ data: helpRequest });
    } catch (err) {
      next(err);
    }
  }

  static async respondToHelpRequest(req, res, next) {
    try {
      const helpRequest = await HelpService.respondToHelpRequest(req.user.id, req.body);
      res.json({ data: helpRequest });
    } catch (err) {
      next(err);
    }
  }

  static async completeHelpRequest(req, res, next) {
    try {
      const helpRequest = await HelpService.completeHelpRequest(req.user.id, req.params.id);
      res.json({ data: helpRequest });
    } catch (err) {
      next(err);
    }
  }
}
