const express = require("express");
const router = express.Router();
const passport = require("../config/passport"); 

const scheduleController = require("../controllers/schedule-controller"); 
const userController = require("../controllers/user-controller"); 
const { generalErrorHandler } = require("../middleware/error-handler");
const admin = require("./modules/admin");
router.use("/admin", admin);
router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp); 
router.get("/signin", userController.signInPage);
router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  userController.signIn
); 
router.get("/logout", userController.logout);

router.get("/schedules", scheduleController.getSchedules);
router.use("/", (req, res) => res.redirect('/schedules'))
router.use("/", generalErrorHandler); 

module.exports = router;