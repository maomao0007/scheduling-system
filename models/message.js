const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
      Message.belongsTo(models.User, {
        as: "recipient",
        foreignKey: "recipientId",
      });
    }
  }

  Message.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "Messages",
      underscored: true,
    }
  );

  return Message;
};
