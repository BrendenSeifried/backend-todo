const { Router } = require('express');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const account = await UserService.create(req.body);
    res.json(account);
  } catch (e) {
    next(e);
  }
});
