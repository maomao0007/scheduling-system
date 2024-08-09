const express = require('express');
const router = express.Router();
const passport = require('../config/passport'); 
const upload = require('../middleware/multer') 

const scheduleController = require('../controllers/schedule-controller'); 
const leaveController = require('../controllers/leave-controller');
const changeShiftController = require('../controllers/changeShift-controller');
const userController = require('../controllers/user-controller'); 
const { authenticated, authenticatedAdmin } = require("../middleware/auth"); 
const { generalErrorHandler } = require('../middleware/error-handler');
const admin = require('./modules/admin');
router.use("/admin", authenticatedAdmin, admin);
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp); 
router.get('/signin', userController.signInPage);
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true,
  }),
  userController.signIn
); 
router.get('/logout', userController.logout);

router.get("/users/:id", authenticated, userController.getProfile);
router.get("/users/:id/edit", authenticated, userController.getEditProfile);
router.put("/users/:id", upload.single('image'), authenticated, userController.putProfile);
router.get('/schedules', authenticated, scheduleController.getSchedules);
router.get(
  '/applyLeaves',
  authenticated,
  leaveController.getApplyLeave
);
router.post('/applyLeaves', authenticated, leaveController.postApplyLeave);
router.get("/leaves/status", authenticated, leaveController.getLeaveStatus);
router.get(
  '/changeShifts',
  authenticated,
  changeShiftController.getChangeShift
);
router.use('/', (req, res) => res.redirect('/schedules'));
router.use('/', generalErrorHandler); 

module.exports = router;