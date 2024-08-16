const { Schedule, User, Shift, Swap } = require('../models');
const swapSchedulesController = {
  getSwapSchedules: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "name"],
        raw: true,
      });
      return res.render("swapSchedules", { users });
    } catch (err) {
      next(err);
    }
  },
  postSwapSchedules: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { colleagueId, reason, startDate, endDate } = req.body;
      if (!colleagueId || !startDate || !endDate)
        throw new Error("Please select the options!");
      if (startDate > endDate)
        throw new Error("Please select the correct date !");

      await Swap.create({ userId, colleagueId, reason, startDate, endDate });

      req.flash("success_messages", "Submitted successfully !");
      return res.redirect("/swap-schedules");
    } catch (err) {
      next(err);
    }
  },
  getSwapStatus: async (req, res, next) => {
    try {
      const swaps = await Swap.findAll({
        where: { userId: req.user.id },
        include: [
          { model: User, as: "Requester" },
          { model: User, as: "Colleague" },
          { model: User, as: "Approver" },
        ],
        order: [["createdAt", "ASC"]],
        raw: true,
        nest: true,
      });
      res.render('swapStatus', { swaps });
    } catch (err) {
      next(err);
    }
  }
};
module.exports = swapSchedulesController;