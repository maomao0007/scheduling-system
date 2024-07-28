const { Schedule, User } = require("../models")

const scheduleController = {
  getSchedules: (req, res, next) => {
    Schedule.findAll({
      include: [{ model: User, attributes: ["name"], as: "User" }],
      nest: true,
      raw: true,
    })
      .then((schedules) => {
        if (!schedules) throw new Error("This schedule didn't exist.");
        // console.log(schedules);
        return res.render("schedules", { schedules });
      })
      .catch((err) => next(err));
  },
  getApplyLeave: (req, res, next) => {
    return res.render("applyLeave", { user: req.user });
  },
  // postLeave: (req, res, next) => {
  //   const { startDate, endDate } = req.body
  //   const { userId } = req.user
  //   Leave.findAll
};
module.exports = scheduleController;
