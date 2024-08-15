'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Shifts', 
    [
      {
        name: 'Morning',
        start_time: '06:30:00',
        end_time: '15:30:00',
      },
      { 
        name: 'Middle',
        start_time: '14:30:00',
        end_time: '23:30:00',
      },
      {
        name: 'Night',
        start_time: '22:30:00',
        end_time: '07:30:00',
      } 
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shifts',null, {});
  }
};
