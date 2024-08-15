'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Schedules', 'shift_id', {
      type: Sequelize.INTEGER,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Schedules', 'shift_id', {
     type: Sequelize.STRING,
    });
  }  
};
