const { Leave } = require('../models');

const leaveController = {
  getApplyLeave: (req, res, next) => {
    return res.render('applyLeaves', { user: req.user });
  },
  postApplyLeave: (req, res, next) => {
    const { name, email, startDate, endDate } = req.body;
    const userId = req.user.id;
    if (!startDate || !endDate) throw new Error('Please select the date !');

    Leave.create({ startDate, endDate, userId, name, email })
      .then(() => {
        req.flash("success_messages", "Submitted successfully");
        res.redirect("/applyLeaves");
        console.log('User ID:', req.user.id);
        console.log('Request Body:', req.body);
      })
      .catch((err) => next(err));
  },
};

module.exports = leaveController;