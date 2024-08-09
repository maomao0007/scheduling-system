"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shift.hasMany(models.Schedule, { foreignKey: "shiftId" });
    }
  }
  Shift.init(
    {
      name: DataTypes.STRING,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Shift",
      tableName: "Shifts",
      underscored: true,
    }
  );
  return Shift;
};
