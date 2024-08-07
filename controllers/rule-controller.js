const { Schedule, User, Shift } = require("../models");
const { Op } = require("sequelize");
const { subDays, startOfWeek, endOfWeek, isSameDay } = require("date-fns");

const ruleController = {
  checkShiftRules: async (userId, date, shiftId) => {
    try {
      // Get shift type
      const shift = await Shift.findByPk(shiftId);
      if (!shift) {
        throw new Error("Invalid shift");
      }
      const shiftName = shift.name;

      // Check if there is already a schedule for the same day
      const sameDay = await Schedule.findOne({
        where: { userId, date: { [Op.eq]: date } },
      });
      if (sameDay) {
        return "An employee can only have one shift per day";
      }

      // Check if a night shift is followed by a morning or middle shift
      if (shiftName === "Morning" || shiftName === "Middle") {
        const previousDay = await Schedule.findOne({
          where: {
            userId,
            date: { [Op.eq]: subDays(date, 1) },
          },
          include: [{ model: Shift, where: { name: "Night" } }],
        });
        if (previousDay) {
          return "Night shift cannot be followed by morning or middle shift";
        }
      }

      // Check if a middle shift is followed by a morning shift
      if (shiftName === "Morning") {
        const previousDay = await Schedule.findOne({
          where: {
            userId,
            date: { [Op.eq]: subDays(date, 1) },
          },
          include: [{ model: Shift, where: { name: "Middle" } }],
        });
        if (previousDay) {
          return "Middle shift cannot be followed by morning shift";
        }
      }

      // Check if there are two days off per week
      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);

      const weekShiftsCount = await Schedule.count({
        where: {
          userId,
          date: { [Op.between]: [weekStart, weekEnd] },
        },
      });

      if (weekShiftsCount >= 5) {
        return "An employee must have two days off per week";
      }

      return null; // No rule violation
    } catch (error) {
      console.error("Error checking shift rules:", error);
      throw error;
    }
  },
};

module.exports = ruleController;
