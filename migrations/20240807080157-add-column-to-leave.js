'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Leaves', 'name', { 
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Leaves', 'is_approved', {  
      type: Sequelize.BOOLEAN 
    });
    await queryInterface.addColumn('Leaves', 'reason', { 
      type: Sequelize.TEXT 
    });
    await queryInterface.addColumn('Leaves', 'approved_by_id', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('Leaves', 'approved_at', {
      type: Sequelize.DATE,
    });
     await queryInterface.addColumn('Leaves', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
     });
  },   

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Leaves', 'name');
    await queryInterface.removeColumn('Leaves', 'is_approved');
    await queryInterface.removeColumn('Leaves', 'reason');
    await queryInterface.removeColumn('Leaves', 'approved_by_id');
    await queryInterface.removeColumn('Leaves', 'approved_at');
    await queryInterface.removeColumn('Leaves', 'status');
  }
};
