'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Schedule.belongsTo(models.User, { foreignKey: 'userId' });
      Schedule.belongsTo(models.Shift, { foreignKey: 'shiftId' });
    }
  }
  Schedule.init(
    {
      date: DataTypes.DATEONLY,
      userId: DataTypes.INTEGER,
      shiftId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Schedule',
      tableName: 'Schedules',
      underscored: true,
    }
  );
  return Schedule;
};