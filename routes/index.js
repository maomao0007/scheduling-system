const express = require("express");
const router = express.Router();
// const admin = require("./modules/admin");

const scheduleController = require("../controllers/schedule-controller"); 
const userController = require("../controllers/user-controller"); 
const { generalErrorHandler } = require("../middleware/error-handler");
const admin = require("./modules/admin");
router.use("/admin", admin);
router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp); 

router.get("/schedules", scheduleController.getSchedules);
router.use("/", (req, res) => res.redirect('/schedules'))
router.use("/", generalErrorHandler); 

module.exports = router;