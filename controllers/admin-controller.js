const { Message, Schedule, User, Leave, Shift, Swap } = require('../models');
const ruleController = require('./rule-controller');
const { getOffset, getPagination } = require('../helpers/pagination-helper');
const { Op } = require('sequelize');

const adminController = {
  getSchedules: (req, res, next) => {
    // 10 entries per page
    const DEFAULT_LIMIT = 10;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    const offset = getOffset(limit, page);
    return Promise.all([
      Schedule.findAll({
        include: ['User', 'Shift'],
        order: [['date', 'ASC']],
        raw: true,
        nest: true,
        limit,
        offset,
      }),
      User.findAll({ raw: true }),
      Shift.findAll({ raw: true }),
    ])
      .then(([schedules, users, shifts]) => {
        return res.render('admin/schedules', {
          schedules,
          users,
          shifts,
          pagination: getPagination(limit, page, schedules.count),
        });
      })
      .catch((err) => next(err));
  },
  createSchedule: async (req, res, next) => {
    try {
      const { date } = req.query;
      const [schedules, users, shifts] = await Promise.all([
        Schedule.findAll({
          include: ['User', 'Shift'],
          raw: true,
          nest: true,
        }),
        User.findAll({ raw: true }),
        Shift.findAll({ raw: true }),
      ]);

      return res.render('admin/schedule-new', {
        schedules,
        users,
        shifts,
        selectedDate: date,
      });
    } catch (err) {
      next(err);
    }
  },
  postSchedule: async (req, res, next) => {
    try {
      const { date, ...shiftSelections } = req.body;
      if (!date) throw new Error('Please select a date!');

      const assignedUsers = new Set();

      for (const [shiftKey, userId] of Object.entries(shiftSelections)) {
        if (!userId) continue;
        const shiftId = shiftKey.split('_')[1];

        // Check scheduling rules
        const ruleViolation = await ruleController.checkShiftRules(
          userId,
          new Date(date),
          shiftId,
          null, // No current schedule ID for post
          assignedUsers // Pass the set of assigned users
        );

        if (ruleViolation) {
          req.flash(
            'error_messages',
            `${ruleViolation} (Shift ID: ${shiftId})`
          );
          return res.redirect('/admin/schedules');
        }

        // Add user to the set of assigned users
        assignedUsers.add(userId);

        // Create the schedule if no rule violation
        await Schedule.create({ date, userId, shiftId });
      }

      req.flash(
        'success_messages',
        'All schedules have been successfully created!'
      );
      return res.redirect('/admin/schedules/calendar');
    } catch (err) {
      next(err);
    }
  },
  putSchedule: async (req, res, next) => {
    try {
      const { date, ...shiftSelections } = req.body;
      const id = req.params.id;

      if (!date) throw new Error('Please select the date!');

      const schedule = await Schedule.findByPk(id);
      if (!schedule) throw new Error('This schedule does not exist.');

      // delete all existing schedules for this date
      await Schedule.destroy({
        where: { date },
      });

      const assignedUsers = new Set();

      for (const [shiftKey, userId] of Object.entries(shiftSelections)) {
        if (!userId) continue;
        const shiftId = shiftKey.split('_')[1];

        const ruleViolation = await ruleController.checkShiftRules(
          userId,
          date,
          shiftId,
          id, // Pass the current schedule ID
          assignedUsers // Pass the set of assigned users
        );
        if (ruleViolation) {
          req.flash(
            'error_messages',
            `${ruleViolation} (Shift ID: ${shiftId})`
          );
          return res.redirect('/admin/schedules/calendar');
        }
        assignedUsers.add(userId);
        await Schedule.create({ date, userId, shiftId });
      }

      req.flash('success_messages', 'Successfully updated!');
      return res.redirect('/admin/schedules/calendar');
    } catch (err) {
      next(err);
    }
  },
  getEditSchedule: async (req, res, next) => {
    try {
      const id = req.params.id;
      const schedule = await Schedule.findByPk(id, {
        include: [{ model: User }, { model: Shift }],
        raw: true,
        nest: true,
      });

      if (!schedule) throw new Error('This schedule does not exist.');
      const [users, shifts, allSchedulesForDay] = await Promise.all([
        User.findAll({ raw: true }),
        Shift.findAll({ raw: true }),
        Schedule.findAll({
          where: { date: schedule.date },
          include: [{ model: User }, { model: Shift }],
          raw: true,
          nest: true,
        }),
      ]);

      const assignmentMap = {};
      allSchedulesForDay.forEach((sch) => {
        if (sch.Shift && sch.User) {
          assignmentMap[sch.Shift.id] = sch.User.id;
        }
      });

      return res.render('admin/schedule-edit', {
        schedule,
        users,
        shifts,
        assignmentMap,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteSchedule: async (req, res, next) => {
    try {
      const id = req.params.id;
      const schedule = await Schedule.findByPk(id);
      if (!schedule) throw new Error('This schedule does not exist.');

      await schedule.destroy();
      req.flash('success_messages', 'Successfully deleted！');
      return res.redirect('/admin/schedules/calendar');
    } catch (err) {
      next(err);
    }
  },
  calendarSchedule: (req, res, next) => {
    return Promise.all([
      Schedule.findAll({
        include: ['User', 'Shift'],
        raw: true,
        nest: true,
      }),
      User.findAll({ raw: true }),
      Shift.findAll({ raw: true }),
    ])
      .then(([schedules, users, shifts]) => {
        return res.render('admin/schedules-calendar', {
          schedules,
          users,
          shifts,
        });
      })
      .catch((next) => next(err));
  },
  getUsers: (req, res, next) => {
    User.findAll({
      raw: true,
    })
      .then((users) => {
        if (!users) throw new Error('No user data has been found.');
        return res.render('admin/users', { users });
      })
      .catch((err) => next(err));
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        if (!user) throw new Error('User didn\'t exist!');
        if (user.email === 'root@example.com') {
          req.flash(
            'error_messages',
            'Unable to modify root access permissions.'
          );
          return res.redirect('back');
        }
        return user.update({ isAdmin: !user.isAdmin });
      })
      .then(() => {
        return res.redirect('/admin/users');
      })
      .catch((err) => next(err));
  },
  getLeaves: async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) throw new Error('Access denied');

    try {
      const leaves = await Leave.findAll({
        include: [
          { model: User, as: 'User' },
          { model: User, as: 'ApprovedBy' },
        ],
        order: [['createdAt', 'ASC']],
        raw: true,
        nest: true,
      });
      const admins = await User.findAll({
        where: { isAdmin: true },
        raw: true,
      });
      res.render('admin/leaves', { leaves, admins });
    } catch (err) {
      next(err);
    }
  },
  getLeave: async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) throw new Error('Access denied');

    try {
      const id = req.params.id;
      const leave = await Leave.findByPk(id, {
        include: [
          { model: User, as: 'User' },
          { model: User, as: 'ApprovedBy' },
        ],
        raw: true,
        nest: true,
      });
      if (!leave) throw new Error('Leave request not found !');

      const admin = await User.findAll({
        where: { isAdmin: true },
        raw: true,
      });
      res.render('admin/leave', { leave, admin });
    } catch (err) {
      next(err);
    }
  },
  postLeave: async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) throw new Error('Access denied');

    try {
      const { status, approvedById } = req.body;
      const id = req.params.id;
      if (!status || !approvedById)
        throw new Error('Missing required fields !');

      await Leave.update(
        { status, approvedById, approvedAt: new Date() },
        { where: { id } }
      );
      req.flash('success_messages', 'Updated successfully !');
      res.redirect('/admin/leaves');
    } catch (err) {
      next(err);
    }
  },
  getSwaps: async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) throw new Error('Access denied');

    try {
      const swaps = await Swap.findAll({
        include: [
          { model: User, as: 'Requester' },
          { model: User, as: 'Colleague' },
          { model: User, as: 'Approver' },
        ],
        order: [['createdAt', 'ASC']],
        raw: true,
        nest: true,
      });
      res.render('admin/schedules-swap', { swaps });
    } catch (err) {
      next(err);
    }
  },
  getSwap: async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) throw new Error('Access denied');

    try {
      const id = req.params.id;
      const swap = await Swap.findByPk(id, {
        include: [
          { model: User, as: 'Requester' },
          { model: User, as: 'Colleague' },
          { model: User, as: 'Approver' },
        ],
        raw: true,
        nest: true,
      });
      if (!swap) throw new Error('Swap schedules request not found !');

      const admin = await User.findAll({
        where: { isAdmin: true },
        raw: true,
      });
      res.render('admin/schedule-swap', { swap, admin });
    } catch (err) {
      next(err);
    }
  },
  postSwap: async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) throw new Error('Access denied');

    try {
      const { status, approvedById } = req.body;
      const id = req.params.id;
      if (!status || !approvedById)
        throw new Error('Missing required fields !');

      await Swap.update(
        { status, approvedById, approvedAt: new Date() },
        { where: { id } }
      );
      req.flash('success_messages', 'Updated successfully !');
      res.redirect('/admin/schedules-swap');
    } catch (err) {
      next(err);
    }
  },
};
module.exports = adminController;
