import User from '../models/user.model.js';

export default class UserRepository {
  static async findAll() {
    return await User.find({});
  }

  static async findByEmail(email, select) {
    const query = User.findOne({ email });
    if (select) {
      return await query.select(select);
    }
    return await query;
  }

  static async findUserWithPasswordByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }



  static async create(userData) {
    return await User.create(userData);
  }
}
