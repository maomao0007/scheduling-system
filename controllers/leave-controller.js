const { Leave, User } = require('../models');

const leaveController = {
  getApplyLeave: (req, res, next) => {
    return res.render('applyLeaves', { user: req.user });
  },
  postApplyLeave: (req, res, next) => {
    const { startDate, endDate, name, reason } = req.body;
    if (!startDate || !endDate) throw new Error('Please select the date !');
    if (startDate > endDate) throw new Error('Please select the correct date !');
      Leave.create({ userId: req.user.id, startDate, endDate, name, reason })
        .then(() => {
          req.flash('success_messages', 'Submitted successfully');
          res.redirect('/applyLeaves');
          // console.log("User ID:", req.user.id);
          // console.log("Request Body:", req.body);
        })
        .catch((err) => next(err));
  },
  getLeaveStatus: async (req, res, next) => {
    try {
      const leaves = await Leave.findAll({
        where: { userId: req.user.id },
        include: [
          { model: User, as: 'User' },
          { model: User, as: 'ApprovedBy' },
        ],
        order: [['createdAt', 'ASC']],
        nest: true,
        raw: true
      });
      res.render('leaveStatus', { leaves });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = leaveController;