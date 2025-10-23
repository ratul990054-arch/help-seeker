import HelpRequest from '../models/helpRequest.model.js';

export default class HelpRequestRepository {
  static async create(data) {
    return await HelpRequest.create(data);
  }
}
