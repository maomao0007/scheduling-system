const bcrypt = require('bcryptjs'); 
const { User, Schedule, Leave, Shift, Swap } = require('../models');
const { imgFileHandler } = require('../helpers/file-helpers');
const { relativeTimeFromNow } = require('../helpers/handlebars-helpers');
const { NUMBER } = require('sequelize');
const redisClient = require('../config/redisClient');

const userController = {
  signUpPage: (req, res) => {
    res.render('signup');
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error('Passwords do not match!');
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) throw new Error('Email already exists!');
        return bcrypt.hash(req.body.password, 10);
      })
      .then((hash) =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        })
      )
      .then(() => {
        req.flash('success_messages', 'Successfully registered！');
        res.redirect('/signin');
      })
      .catch((err) => next(err));
  },
  signInPage: (req, res) => {
    res.render('signin');
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Successfully logged in！');
    res.redirect('/schedules');
  },
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success_messages', 'Successfully logged out！');
      res.redirect('/signin');
    });
  },
  getProfile: async (req, res, next) => {
    try {
      const id = req.user.id;
      const profileUserId = req.params.id;

      // Attempt to retrieve data from Redis
      const cachedProfileUser = await redisClient.get(
        `profile:${profileUserId}`
      );
      let profileUser;

      if (cachedProfileUser) {
        console.log('Profile data retrieved from Redis cache');
        profileUser = JSON.parse(cachedProfileUser);
      } else {
        console.log('Fetching profile data from database');
        profileUser = await User.findByPk(profileUserId, { raw: true });

        if (!profileUser) {
          throw new Error('This user does not exist!');
        }

        // Store data in Redis with a 10 mins expiration
        await redisClient.set(
          `profile:${profileUserId}`,
          JSON.stringify(profileUser),
          'EX',
          600
        );
      }

      const user = await User.findByPk(id, { raw: true });

      res.render('users/profile', {
        user, // This is for the header
        profileUser, // This is for the profile
      });
    } catch (err) {
      next(err);
    }
  },
  getEditProfile: async (req, res, next) => {
    try {
      const id = req.user.id;
      const profileUserId = req.params.id;

      const [user, profileUser] = await Promise.all([
        User.findByPk(id, { raw: true }),
        User.findByPk(profileUserId, { raw: true }),
      ]);
      if (!profileUser) {
        throw new Error('This user does not  exist !');
      }
      if (Number(id) !== Number(profileUserId)) {
        throw new Error('You don\'t have permission to edit this profile!');
      }

      res.render('users/edit', {
        user, // This is for the header
        profileUser, // This is for the profile
      });
    } catch (err) {
      next(err);
    }
  },
  putProfile: async (req, res, next) => {
    try {
      const { file } = req;
      const id = req.user.id;
      const profileUserId = req.params.id;

      if (Number(id) !== Number(profileUserId)) {
        throw new Error('You don\'t have permission to edit this profile!');
      }
      const [user, profileUser, filePath] = await Promise.all([
        User.findByPk(id, { raw: true }),
        User.findByPk(profileUserId),
        imgFileHandler(file),
      ]);

      if (!profileUser) throw new Error('This user does not exist !');

      await profileUser.update({
        image: filePath || profileUser.image,
      });

      // Invalidate the user profile cache in Redis
      try {
        await redisClient.del(`profile:${profileUserId}`);
        console.log(`Redis cache cleared for user ${profileUserId}`);
      } catch (redisError) {
        console.error('Error clearing Redis cache:', redisError);
      }

      res.render('users/profile', {
        user, // This is for the header
        profileUser: profileUser.toJSON(), // Use the latest data
      });
    } catch (err) {
      next(err);
    }
  },
  getFeeds: async (req, res, next) => {
    try {
      const id = req.user.id;
      const [user, schedules, leaves, swaps] = await Promise.all([
        User.findByPk(id, { raw: true }),
        Schedule.findAll({
          where: { userId: id },
          order: [['createdAt', 'DESC']],
          include: [{ model: Shift, attributes: ['name'] }],
          raw: true,
          nest: true,
        }),
        Leave.findAll({
          where: { userId: id },
          order: [['createdAt', 'ASC']],
          raw: true,
        }),
        Swap.findAll({
          where: { userId: id },
          include: [{ model: User, as: 'Colleague' }],
          order: [['createdAt', 'ASC']],
          nest: true,
          raw: true,
        }),
      ]);

      const hasNotifications =
        schedules.length > 0 || leaves.length > 0 || swaps.length > 0;
      if (!hasNotifications) {
        req.flash('info', 'There are no notifications.');
        return res.redirect('/schedules/calendar');
      }

      res.render('feeds', { user, schedules, leaves, swaps });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;