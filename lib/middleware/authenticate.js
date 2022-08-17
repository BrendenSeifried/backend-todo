const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];
    if (!cookie) throw new Error('Please sign in to continue');
    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};
