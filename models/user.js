'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Schedule, { foreignKey: 'userId' });
      User.hasMany(models.Leave, { foreignKey: 'userId', as: 'Leaves' });
      User.hasMany(models.Leave, { foreignKey: 'approvedById', as: 'ApprovedBy' });
      User.hasMany(models.Swap, { foreignKey: 'userId', as: 'RequestedSwaps' });
      User.hasMany(models.Swap, {
        foreignKey: 'approvedById',
        as: 'ApprovedSwaps',
      });
      User.hasMany(models.Swap, {
        foreignKey: 'colleagueId',
        as: 'ColleagueSwaps',
      });
      User.hasMany(models.Message, {
        as: 'SentMessages',
        foreignKey: 'senderId',
      });
      User.hasMany(models.Message, {
        as: 'ReceivedMessages',
        foreignKey: 'recipientId',
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  });
  return User;
};