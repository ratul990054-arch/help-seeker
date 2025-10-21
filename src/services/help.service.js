
import HelpRequest from '../models/helpRequest.model.js';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

export default class HelpService {
  static async createHelpRequest(userId, { lat, lng }) {
    const seeker = await User.findById(userId);
    if (!seeker) {
      throw new AppError('User not found', 404);
    }

    if (seeker.role !== 'seeker' && seeker.role !== 'both') {
      throw new AppError('Only seekers can create help requests', 403);
    }

    const location = {
      type: 'Point',
      coordinates: [lng, lat],
    };

    const nearbyGivers = await User.find({
      location: {
        $near: {
          $geometry: location,
          $maxDistance: 3000, // 3 km
        },
      },
      role: { $in: ['giver', 'both'] },
    });

    const helpRequest = await HelpRequest.create({
      seeker: userId,
      location,
      nearbyGivers: nearbyGivers.map(giver => giver._id),
    });

    // TODO: Emit 'newHelpRequest' to nearbyGivers

    return helpRequest;
  }

  static async respondToHelpRequest(userId, { helpRequestId, action }) {
    const helpRequest = await HelpRequest.findById(helpRequestId);
    if (!helpRequest) {
      throw new AppError('Help request not found', 404);
    }

    if (helpRequest.status !== 'pending') {
      throw new AppError('This help request is no longer pending', 400);
    }

    const giver = await User.findById(userId);
    if (!giver || (giver.role !== 'giver' && giver.role !== 'both')) {
      throw new AppError('Only givers can respond to help requests', 403);
    }

    if (!helpRequest.nearbyGivers.includes(userId)) {
      throw new AppError('You are not eligible to respond to this request', 403);
    }

    if (action === 'accept') {
      helpRequest.status = 'accepted';
      helpRequest.giver = userId;
      await helpRequest.save();
      // TODO: Emit 'helpRequestAccepted' to the seeker
    } else if (action === 'reject') {
      // Optional: Implement rejection logic, e.g., remove from nearbyGivers
      // For now, we do nothing
    }

    return helpRequest;
  }

  static async completeHelpRequest(userId, helpRequestId) {
    const helpRequest = await HelpRequest.findById(helpRequestId);
    if (!helpRequest) {
      throw new AppError('Help request not found', 404);
    }

    if (helpRequest.seeker.toString() !== userId && helpRequest.giver.toString() !== userId) {
      throw new AppError('Only the seeker or the accepted giver can complete this request', 403);
    }

    helpRequest.status = 'completed';
    helpRequest.completedAt = new Date();
    await helpRequest.save();

    // TODO: Emit 'helpRequestCompleted' to the other party

    return helpRequest;
  }
}
