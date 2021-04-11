const router = require('express').Router();
const User = require('../models/user.model');
const Exercise = require('../models/exercise.model');

router.get('/users', async (_req, res, next) => {
  try {
    const allUser = await User.find();
    res.send(allUser);
  } catch (e) {
    next(e);
  }
});

router.post('/new-user', async (req, res, next) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    res.send(result);
  } catch (e) {
    next(e);
  }
});

router.post('/add', async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return next({ message: 'User doesn\'t exists' });
    }
    const exercise = new Exercise(req.body);
    const result = await exercise.save();
    res.json({
      _id: user._id,
      username: user.username,
      description: result.description,
      duration: result.duration,
      date: result.date.toDateString()
    });
  } catch (e) {
    next(e);
  }
});

router.get('/log', async (req, res, next) => {
  const { from, to, limit, userId } = req.query;
  console.log(req.query);
  const option = {};
  if (userId) {
    option.userId = userId;
  }
  if (from && to) {
    option.date = {
      $gte: from, $lte: to
    }
  }
  try {
    const log = await Exercise.find(option).limit(parseInt(limit) || 0);
    if (userId) {
      res.json({ log, count: log.length });
    } else {
      res.send(log);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;