const { Schedule, User, Shift } = require("../models");
const { Op } = require("sequelize");
const { subDays, startOfWeek, endOfWeek, isSameDay, format } = require("date-fns");

const ruleController = {
  checkShiftRules: async (userId, date, shiftId, currentScheduleId = null) => {
    try {
      // Get shift type
      const shift = await Shift.findByPk(shiftId);
      if (!shift) {
        throw new Error("Invalid shift");
      }
      const shiftName = shift.name;

      // Check if there is already a schedule for the same day
      const whereClause = {
        userId,
        date: { [Op.eq]: date },
      };

      // Exclude the current schedule if we're updating
      if (currentScheduleId) {
        whereClause.id = { [Op.ne]: currentScheduleId };
      }

      const sameDay = await Schedule.findOne({ where: whereClause });

      if (sameDay) {
        return "An employee can only have one shift per day";
      }

      // Rest of the function remains the same...

      return null; // No rule violation
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ruleController;
