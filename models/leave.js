'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Leave.belongsTo(models.User, { foreignKey: 'userId', as:'User' });
      Leave.belongsTo(models.User, { foreignKey: "approvedById", as: "ApprovedBy" });
    }
  }
  Leave.init({
    name: DataTypes.STRING,
    isApproved: DataTypes.BOOLEAN,
    reason: DataTypes.TEXT,
    approvedById: DataTypes.INTEGER,
    approvedAt: DataTypes.DATE,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },

  }, {
    sequelize,
    modelName: 'Leave',
    tableName: 'Leaves',
    underscored: true,
  });
  return Leave;
};