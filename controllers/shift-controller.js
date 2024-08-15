const { Shift } = require('../models');

const shiftServices = {
  getShifts: (req, res, next) => {
    return Promise.all([
      Shift.findAll({ raw: true }),
      req.params.id ? Shift.findByPk(req.params.id, { raw: true }) : null,
    ])
      .then(([shifts, shift]) => res.render('admin/shifts', { shifts, shift }))
      .catch((err) => next(err));
  },
  postShift: (req, res, next) => {
    const { name, startTime, endTime } = req.body;
    if (!name) throw new Error('Shift name is required!');
    if (!startTime) throw new Error('Start Time is required!');
    if (!endTime) throw new Error('End Time is required!');

    return Shift.create({ name, startTime, endTime })
      .then(() => res.redirect('/admin/shifts'))
      .catch((err) => next(err));
  },
  putShift: (req, res, next) => {
    const { name, startTime, endTime } = req.body;
    if (!name) throw new Error('Shift name is required!');
    if (!startTime) throw new Error('Start Time is required!');
    if (!endTime) throw new Error('End Time is required!');

    return Shift.findByPk(req.params.id)
      .then((shift) => {
        if (!shift) throw new Error('Shift doesn\'t exist!');
        return shift.update({ name, startTime, endTime });
      })
      .then(() => res.redirect('/admin/shifts'))
      .catch((err) => next(err));
  },
  deleteShift: (req, res, next) => {
    Shift.findByPk(req.params.id)
      .then((shift) => {
        if (!shift) throw new Error('Shift doesn\'t exist!');
        return shift.destroy();
      })
      .then(() => res.redirect('/admin/shifts'))
      .catch((err) => next(err));
  },
};
module.exports = shiftServices;
