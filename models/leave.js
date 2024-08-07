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
      Leave.belongsTo(models.User, { foreignkey: 'userId' });
      Leave.belongsTo(models.User, { foreignkey: "approvedById" });
    }
  }
  Leave.init({
    name: DataTypes.STRING,
    is_approved: DataTypes.BOOLEAN,
    reason: DataTypes.TEXT,
    approvedById: DataTypes.INTEGER,
    approvedAt: DataTypes.DATE,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Leave',
    tableName: 'Leaves',
    underscored: true,
  });
  return Leave;
};