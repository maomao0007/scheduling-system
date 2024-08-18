const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin-controller');
const shiftController = require('../../controllers/shift-controller');
const ruleController = require('../../controllers/rule-controller');

router.post('/schedules', adminController.postSchedule);
router.put('/schedules/:id', adminController.putSchedule);
router.get('/schedules/:id/edit', adminController.getEditSchedule);
router.delete('/schedules/:id', adminController.deleteSchedule);
router.get('/schedules', adminController.getSchedules);
router.get('/schedules/new', adminController.createSchedule);
router.get('/schedules/calendar', adminController.calendarSchedule);
router.patch('/users/:id', adminController.patchUser);
router.get('/users', adminController.getUsers);
router.post('/leaves/:id', adminController.postLeave);
router.get('/leaves/:id', adminController.getLeave);
router.get('/leaves', adminController.getLeaves);
router.get('/shifts/:id', shiftController.getShifts);
router.put('/shifts/:id', shiftController.putShift);
router.delete('/shifts/:id', shiftController.deleteShift);
router.post('/shifts', shiftController.postShift);
router.get('/shifts', shiftController.getShifts);
router.post("/schedules-swap/:id", adminController.postSwap);
router.get("/schedules-swap/:id", adminController.getSwap);
router.get("/schedules-swap", adminController.getSwaps);

router.use('/', (req, res) => res.redirect('/admin/schedules/calendar'));
module.exports = router;
