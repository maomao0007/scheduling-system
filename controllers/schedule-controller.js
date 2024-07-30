const { Schedule, User, Leave } = require('../models');

const scheduleController = {
  getSchedules: (req, res, next) => {
    Schedule.findAll({
      include: [{ model: User, attributes: ['name'], as: 'User' }],
      nest: true,
      raw: true,
    })
      .then((schedules) => {
        if (!schedules) throw new Error('This schedule didn\'t exist.');
        // console.log(schedules);
        return res.render('schedules', { schedules });
      })
      .catch((err) => next(err));
  },
};
module.exports = scheduleController;
