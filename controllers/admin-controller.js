const { Schedule, User, Leave, Shift } = require('../models');
const adminController = {
  getSchedules: (req, res, next) => {
    return Promise.all([
      Schedule.findAll({
        include: ["User", "Shift"],
        order: [["date", "ASC"]],
        raw: true,
        nest: true,
      }),
      User.findAll({ raw: true }),
      Shift.findAll({ raw: true }),
    ])
      .then(([schedules, users, shifts]) => {
        console.log(schedules);
        return res.render("admin/schedules", { schedules, users, shifts });
      })
      .catch((err) => next(err));
  },
  createSchedule: (req, res, next) => {
    return Promise.all([
      Schedule.findAll({
        include: ["User", "Shift"],
        raw: true,
        nest: true,
      }),
      User.findAll({ raw: true }),
      Shift.findAll({ raw: true }),
    ])
      .then(([schedules, users, shifts]) => {
        console.log("Schedules:", schedules);
        console.log("Users:", users);
        console.log("Shifts:", shifts);
        return res.render("admin/create-schedule", {
          schedules,
          users,
          shifts,
        });
      })
      .catch((next) => next(err));
  },
  //   postSchedule: async (req, res, next) => {
  //     try {
  //         const { date, userId, shiftId } = req.body;
  //         if (!date) throw new Error("Please select date !");
  //         if (!userId) throw new Error ("Please select userId !");
  //         if (!shiftId) throw new Error("Please select shiftId !");

  //         await Schedule.create({ date, userId, shiftId });

  //         req.flash("success_messages", "Schedule has been successfully created!");

  //         return res.redirect("/admin/schedules");
  //     } catch (err) {
  //         next(err);
  //     }
  // },
  postSchedule: (req, res, next) => {
    const { date, userId, shiftId } = req.body;
    if (!date) throw new Error("Please select date !");
    if (!userId) throw new Error("Please select userId !");
    if (!shiftId) throw new Error("Please select shiftId !");
    Schedule.create({
      date,
      userId,
      shiftId,
    })
      .then(() => {
        req.flash(
          "success_messages",
          "Schedule has been successfully created !"
        );
        return res.redirect("/admin/schedules");
      })
      .catch((err) => next(err));
  },
  calendarSchedule: (req, res, next) => {
    return Promise.all([
      Schedule.findAll({
        include: ["User", "Shift"],
        raw: true,
        nest: true,
      }),
      User.findAll({ raw: true }),
      Shift.findAll({ raw: true }),
    ])
      .then(([schedules, users, shifts]) => {
        console.log("Schedules:", schedules);
        console.log("Users:", users);
        console.log("Shifts:", shifts);
        return res.render("admin/schedules-calendar", {
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
        if (!users) throw new Error("No user data has been found.");
        return res.render("admin/users", { users });
      })
      .catch((err) => next(err));
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        if (!user) throw new Error("User didn't exist!");
        if (user.email === "root@example.com") {
          req.flash(
            "error_messages",
            "Unable to modify root access permissions."
          );
          return res.redirect("back");
        }
        return user.update({ isAdmin: !user.isAdmin });
      })
      .then(() => {
        return res.redirect("/admin/users");
      })
      .catch((err) => next(err));
  },
  getLeaves: (req, res, next) => {
    if (!req.user || !req.user.isAdmin) throw new Error("Access denied");

    Leave.findAll({
      include: [{ model: User, attributes: ["name", "email"] }],
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    })
      .then((leaves) => {
        res.render("admin/leaves", { leaves });
        console.log(leaves);
      })
      .catch((err) => next(err));
  },
};
module.exports = adminController;
