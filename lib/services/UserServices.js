const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    if (email.length <= 7) {
      throw new Error('Email must be at least seven characters long');
    }
    if (password.length < 7) {
      throw new Error('Password must be at least seven characters long');
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const account = await User.insert({ email, passwordHash });
    return account;
  }
};
