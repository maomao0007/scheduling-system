const {  } = require('../models');
const changeShiftController = {
  getChangeShift: (req, res, next) => {
  return res.render('changeShifts', { user: req.user });
  }
};

module.exports = changeShiftController;