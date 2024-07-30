const { User, Leave } = require('../models');
const adminController = {
  getSchedules: (req, res) => {
    return res.render("admin/schedules");
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
          )
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
