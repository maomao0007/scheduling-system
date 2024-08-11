const { Schedule, User, Leave, Shift } = require('../models');
const ruleController = require("./rule-controller");

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
  createSchedule: async (req, res, next) => {
    try {
    const { date } = req.query;
    const [schedules, users, shifts] = await Promise.all([
      Schedule.findAll({
        include: ["User", "Shift"],
        raw: true,
        nest: true,
      }),
      User.findAll({ raw: true }),
      Shift.findAll({ raw: true }),
    ])
    
        console.log("Schedules:", schedules);
        console.log("Users:", users);
        console.log("Shifts:", shifts);
        return res.render("admin/create-schedule", {
          schedules,
          users,
          shifts,
          selectedDate: date,
        })
    }
      catch (err) {
      next(err);
   }
  },
  postSchedule: async (req, res, next) => {
    try {
      const { date, ...shiftSelections } = req.body;
      if (!date) throw new Error("Please select a date!");

      let createdCount = 0;
      for (const [shiftKey, userId] of Object.entries(shiftSelections)) {
        if (!userId) continue;
        const shiftId = shiftKey.split("_")[1];

        // Check scheduling rules
        const ruleViolation = await ruleController.checkShiftRules(
          userId,
          new Date(date),
          shiftId
        );

        if (ruleViolation) {
          req.flash(
            "error_messages",
            `${ruleViolation} (Shift ID: ${shiftId})`
          );
          return res.redirect("/admin/schedules");
        }

        // Create the schedule if no rule violation
        await Schedule.create({ date, userId, shiftId });
      }

      // If we've made it here, all schedules were created successfully
      req.flash(
        "success_messages",
        "All schedules have been successfully created!"
      );
      return res.redirect("/admin/schedules");

    } catch (err) {
      next(err);
    }
  },
  putSchedule: async (req, res, next) => {
    try {
      const { date, userId, shiftId } = req.body;
      const id = req.params.id;

      if (!date) throw new Error("Please select the date !");
      if (!userId) throw new Error("Please select userId !");
      if (!shiftId) throw new Error("Please select shiftId !");

      // Check scheduling rules
      const ruleViolation = await ruleController.checkShiftRules(
        userId,
        new Date(date),
        shiftId
      );
      if (ruleViolation) {
        req.flash("error_messages", ruleViolation);
        return res.redirect("/admin/schedules");
      }

      const schedule = await Schedule.findByPk(id);

      if (!schedule) throw new Error("This schedule does not exist.");
      await schedule.update({
        date,
        userId,
        shiftId,
      });

      req.flash("success_messages", "Successfully updated !");
      return res.redirect("/admin/schedules");
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

     if (!schedule) throw new Error("This schedule does not exist.");

     // Get all schedules for the same day
     const allSchedulesForDay = await Schedule.findAll({
       where: { date: schedule.date },
       include: [{ model: User }, { model: Shift }],
       raw: true,
       nest: true,
     });

    const assignmentMap = {};
    allSchedulesForDay.forEach((sch) => {
      if (sch.Shift && sch.User) {
        assignmentMap[sch.Shift.id] = sch.User.id;
      }
    });

     const [users, shifts] = await Promise.all([
       User.findAll({raw: true}),
       Shift.findAll({raw: true}),
     ]);
     console.log("Schedule:", schedule);
     console.log("All Schedules for Day:", allSchedulesForDay);
     console.log("Users:", users);
     console.log("Shifts:", shifts);
     console.log("Assignment Map:", assignmentMap);

     return res.render("admin/edit-schedule", {
       schedule,
       allSchedulesForDay,
       users,
       shifts,
       assignmentMap,
     });
   } catch (err) {
     next(err);
   }
},
  deleteSchedule: (req, res, next) => {
    const id = req.params.id;
    Schedule.findByPk(id)
      .then((schedule) => {
        if (!schedule) throw new Error("This schedule does not exist.");
        return schedule.destroy();
      })
      .then(() => {
        req.flash("success_messages", "Successfully deleted！");
        return res.redirect("/admin/schedules");
      })
      .catch((err) => next(err));
  },
  // bulkCreateSchedules: async (req, res, next) => {
  //   try {
  //     const { date, assignments } = req.body;

  //     for (const [shiftId, userId] of Object.entries(assignments)) {
  //       if (userId) {
  //         await Schedule.findOrCreate({
  //           where: { date, shiftId },
  //           defaults: { userId },
  //         });
  //       }
  //     }

  //     req.flash(
  //       "success_messages",
  //       "Schedules have been successfully created!"
  //     );
  //     res.redirect("/admin/schedules");
  //   } catch (err) {
  //     next(err);
  //   }
  // },
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
        // console.log("Schedules:", schedules);
        // console.log("Users:", users);
        // console.log("Shifts:", shifts);
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
  getLeaves: async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) throw new Error("Access denied");

    try {
      const leaves = await Leave.findAll({
        include: [
          { model: User, as: "User" },
          { model: User, as: "ApprovedBy" },
        ],
        order: [["createdAt", "ASC"]],
        raw: true,
        nest: true,
      });
      const admins = await User.findAll({
        where: { isAdmin: true },
        raw: true,
      });
      res.render("admin/leaves", { leaves, admins });
    } catch (err) {
      next(err);
    }
  },
  getLeave: async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) throw new Error("Access denied");

    try {
      const id = req.params.id;
      const leave = await Leave.findByPk(id, {
        include: [
          { model: User, as: "User" },
          { model: User, as: "ApprovedBy" },
        ],
        raw: true,
        nest: true,
      });
      if (!leave) throw new Error("Leave request not found !");

      const admin = await User.findAll({
        where: { isAdmin: true },
        raw: true,
      });
      res.render("admin/leave", { leave, admin });
    } catch (err) {
      next(err);
    }
  },
  postLeave: async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) throw new Error("Access denied");

    try {
      const { status, approvedById } = req.body;
      const id = req.params.id;
      if (!status || !approvedById)
        throw new Error("Missing required fields !");

      await Leave.update(
        { status, approvedById, approvedAt: new Date() },
        { where: { id } }
      );
      req.flash("success_messages", "Updated successfully !");
      res.redirect("/admin/leaves");
    } catch (err) {
      next(err);
    }
  },
};
module.exports = adminController;
