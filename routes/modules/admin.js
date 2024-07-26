const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin-controller");
router.get("/scheduled", adminController.getSchedules);
router.use("/", (req, res) => res.redirect("/admin/schedules"));
module.exports = router;
