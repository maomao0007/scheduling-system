"use strict";
const dayjs = require("dayjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id, name FROM Users WHERE name != 'root';`
    );

    const userIds = users[0].map((user) => user.id);
    const shifts = ["Dayshift", "Middleshift", "Nightshift"];
    const daysOffPerWeek = 2;
    const schedules = [];
    const currentDate = dayjs();
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month();
    const daysInMonth = dayjs(
      new Date(currentYear, currentMonth + 1, 0)
    ).date();

    const userSchedule = {};
    userIds.forEach((userId) => {
      userSchedule[userId] = {
        daysOff: 0,
        lastShift: null,
        consecutiveDaysOff: 0,
      };
    });

    for (let day = 1; day <= daysInMonth; day++) {
      const date = dayjs(new Date(currentYear, currentMonth, day)).format(
        "YYYY-MM-DD"
      );

      let assignedShifts = {
        Dayshift: null,
        Middleshift: null,
        Nightshift: null,
      };

      userIds.forEach((userId) => {
        const totalDays = dayjs(date).day();
        const userShiftData = userSchedule[userId];

        // Ensure each user has two days off per week
        if (
          userShiftData.daysOff < daysOffPerWeek &&
          (userShiftData.consecutiveDaysOff < 2 || totalDays % 7 === 0)
        ) {
          userShiftData.daysOff++;
          userShiftData.consecutiveDaysOff++;
          return;
        }

        const availableShifts = shifts.filter((shift) => {
          if (shift === "Dayshift") return assignedShifts[shift] === null;
          if (shift === "Middleshift" && userShiftData.lastShift !== "Dayshift")
            return assignedShifts[shift] === null;
          if (
            shift === "Nightshift" &&
            userShiftData.lastShift !== "Middleshift"
          )
            return assignedShifts[shift] === null;
          return false;
        });

        if (availableShifts.length > 0) {
          const assignedShift =
            availableShifts[Math.floor(Math.random() * availableShifts.length)];
          userShiftData.lastShift = assignedShift;
          userShiftData.consecutiveDaysOff = 0; // Reset consecutive days off counter

          assignedShifts[assignedShift] = userId;
          schedules.push({
            user_id: userId,
            shift: assignedShift,
            date: date,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      });
    }

    await queryInterface.bulkInsert("Schedules", schedules, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Schedules", null, {});
  },
};
