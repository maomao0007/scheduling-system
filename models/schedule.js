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
      Schedule.belongsTo(models.User, { foreignkey: 'userId' });
    }
  }
  Schedule.init(
    {
      userId: DataTypes.INTEGER,
      shift: DataTypes.STRING,
      date: DataTypes.DATEONLY,
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