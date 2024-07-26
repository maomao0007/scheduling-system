const adminController = {
  getSchedules: (req, res) => {
    return res.render("admin/schedules");
  },
};
module.exports = adminController;
