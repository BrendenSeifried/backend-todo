const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
  static async signIn({ email, password = '' }) {
    try {
      const user = await User.getByEmail(email);

      if (!user) throw new Error('Invalid email');
      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('Invalid password');

      const accessToken = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      return accessToken;
    } catch (e) {
      error.status = 401;
      throw error;
    }
  }
};
