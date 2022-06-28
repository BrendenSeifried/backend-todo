const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Todo = require('../models/Todo');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const data = await Todo.insert({ ...req.body, user_id: req.user.id });
      res.json(data);
    } catch (e) {
      next(e);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const data = await Todo.getAll(req.user.id);
      res.json(data);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', [authenticate, authorize], async (req, res, next) => {
    try {
      const data = await Todo.updateById(req.params.id, req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', async (req, res, next) => {
    try {
      const deleted = await Todo.delete(req.params.id);
      res.json(deleted);
    } catch (e) {
      next(e);
    }
  });
