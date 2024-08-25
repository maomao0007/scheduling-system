'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Swap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Swap.belongsTo(models.User, { foreignKey: 'userId', as: 'Requester' });
      Swap.belongsTo(models.User, {
        foreignKey: 'approvedById',
        as: 'Approver',
      });
      Swap.belongsTo(models.User, {
        foreignKey: 'colleagueId',
        as: 'Colleague',
      });
    }
  }
  Swap.init(
    {
      userId: DataTypes.INTEGER,
      colleagueId: DataTypes.INTEGER,
      approvedById: DataTypes.INTEGER,
      approvedAt: DataTypes.DATE,
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
      reason: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Swap',
      tableName: 'Swaps',
      underscored: true,
    }
  );
  return Swap;
};