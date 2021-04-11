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
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return next({ message: 'User doesn\'t exists' });
    }
    const exercise = new Exercise(req.body);
    const result = await exercise.save();
    res.send(result);
  } catch (e) {
    next(e);
  }
});

router.get('/log', async (req, res, next) => {
  const { from, to, limit, userId } = req.query;
  try {
    let log;
    if (userId) {
      log = await getUserLog(userId);
    } else {
      log = await getLogByTime(from, to, limit);
    }
    res.send(log);
  } catch (e) {
    next(e);
  }
});

async function getUserLog(userId) {
  return await Exercise.find({ userId });
}

async function getLogByTime(from, to, limit) {
  return await Exercise.find({
    date: { $gt: from, $lt: to }
  }).limit(limit || 0);
}

module.exports = router;