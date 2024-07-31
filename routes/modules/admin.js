const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin-controller');
const shiftController = require("../../controllers/shift-controller");
const { authenticatedAdmin } = require('../../middleware/auth'); 
router.post("/schedules", authenticatedAdmin, adminController.postSchedules);
router.get('/schedules', authenticatedAdmin, adminController.getSchedules);
router.patch("/users/:id", authenticatedAdmin, adminController.patchUser);
router.get("/users", authenticatedAdmin, adminController.getUsers);
router.get('/leaves', authenticatedAdmin, adminController.getLeaves);
router.get("/shifts/:id", authenticatedAdmin, shiftController.getShifts);
router.put("/shifts/:id", authenticatedAdmin, shiftController.putShift);
router.delete("/shifts/:id", authenticatedAdmin, shiftController.deleteShift);
router.post("/shifts", authenticatedAdmin, shiftController.postShift);
router.get("/shifts", authenticatedAdmin, shiftController.getShifts);
router.use('/', (req, res) => res.redirect('/admin/schedules'));
module.exports = router;
