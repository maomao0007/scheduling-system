const { Schedule, User, Shift } = require('../models');

const scheduleController = {
  getSchedules: async (req, res, next) => {
   try{
    const [schedules, users, shifts] = await Promise.all([
    Schedule.findAll({
      include:  ["User", "Shift"],
      nest: true,
      raw: true,
    }),
      User.findAll({ raw: true }),
      Shift.findAll({ raw: true }),
    ])
      console.log(schedules);
      if (!schedules) throw new Error('This schedule did not exist.');
      return res.render('schedules', { schedules, users, shifts });

    } catch(err) { 
      next(err)}
  }
}
module.exports = scheduleController;
