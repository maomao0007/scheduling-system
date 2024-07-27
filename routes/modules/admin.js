const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin-controller");
const { authenticatedAdmin } = require("../../middleware/auth"); 
router.get("/scheduled", authenticatedAdmin, adminController.getSchedules);
router.use("/", (req, res) => res.redirect("/admin/schedules"));
module.exports = router;
