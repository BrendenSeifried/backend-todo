const Todo = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const info = await Todo.getById(req.params.id);
    if (!info || info.user_id !== req.user.id) {
      console.log('info', info);
      console.log(req.user.id);

      throw new Error(
        'You are not permitted to view this page, try harder next time'
      );
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
