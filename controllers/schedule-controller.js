const { Schedule, User, Shift } = require('../models');

const scheduleController = {
  getSchedules: async (req, res, next) => {
    try {
      
      const userId = req.user.id;
      const [schedules, users, shifts] = await Promise.all([
        Schedule.findAll({
          include: ["User", "Shift"],
          nest: true,
          raw: true,
        }),
        User.findAll({ raw: true }),
        Shift.findAll({ raw: true }),
      ]);
      if (!schedules) throw new Error("This schedule does not exist.");
      return res.render("schedules", {
        id: userId,
        schedules,
        users,
        shifts,
      });
    } catch (err) {
      next(err);
    }
  },
  getSchedule: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const schedules = await Schedule.findAll({
        where: { userId },
        include: ['User', 'Shift'],
        order: [['date', 'ASC']],
        nest: true,
        raw: true,
      });
      if (schedules.length === 0) {
        return res.render('schedule', {
          schedules: [],
          message: 'No schedules found.',
        });
      }
      return res.render('schedule', { schedules });
    } catch (err) {
      next(err);
    }
  }
};
module.exports = scheduleController;
