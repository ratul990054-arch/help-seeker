import HelpRequestRepository from '../repositories/helpRequest.repository.js';
import UserRepository from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';
import { emitToUser } from '../socket.js';
import { sendNotification } from '../utils/sendNotification.js';

export default class HelpService {
  static async askHelp(requesterId, latitude, longitude) {
    const requester = await UserRepository.findById(requesterId);
    if (!requester) {
      throw new AppError('User not found', 404);
    }

    const helpRequest = await HelpRequestRepository.create({
      requester: requesterId,
      location: { type: 'Point', coordinates: [longitude, latitude] },
      radius: requester.helpRadius,
    });

    const nearbyGivers = await UserRepository.find({
      role: { $in: ['giver', 'both'] },
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: requester.helpRadius,
        },
      },
    });

    let notifiedUsers = 0;
    for (const giver of nearbyGivers) {
      const isEmitted = emitToUser(giver._id.toString(), 'helpRequestCreated', helpRequest);
      if (isEmitted) {
        notifiedUsers++;
      } else if (giver.fcmToken) {
        await sendNotification(giver.fcmToken, 'Someone nearby needs your help! Tap to open the app.');
        notifiedUsers++;
      }
    }

    return { helpRequest, notifiedUsers };
  }
}
