const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin-controller');
const shiftController = require("../../controllers/shift-controller");

router.post("/schedules", adminController.postSchedule);
router.get('/schedules', adminController.getSchedules);
router.get("/schedules/create", adminController.createSchedule);
router.get("/schedules/calendar", adminController.calendarSchedule);
router.patch("/users/:id", adminController.patchUser);
router.get("/users", adminController.getUsers);
router.get('/leaves', adminController.getLeaves);
router.get("/shifts/:id", shiftController.getShifts);
router.put("/shifts/:id", shiftController.putShift);
router.delete("/shifts/:id", shiftController.deleteShift);
router.post("/shifts", shiftController.postShift);
router.get("/shifts", shiftController.getShifts);
router.use('/', (req, res) => res.redirect('/admin/schedules'));
module.exports = router;
