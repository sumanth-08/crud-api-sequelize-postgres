const { Model, DataTypes } = require("sequelize");
const { getConnection } = require("../helper/databaseConnection");

const userModel = {
  first_name: {
    type: new DataTypes.STRING(200),
    allowNull: false,
  },

  last_name: {
    type: new DataTypes.STRING(200),
    allowNull: false,
  },

  phone: {
    type: new DataTypes.STRING(200),
    allowNull: false,
    unique: true,
  },

  email: {
    type: new DataTypes.STRING(200),
    allowNull: false,
    trim: true,
    lowercase: true,
    unique: true,
  },

  image: {
    data: Buffer,
    type: new DataTypes.STRING(200),
    required: true,
  },

  isActive: {
    type: new DataTypes.BOOLEAN(),
    defaultValue: true,
  },
};

let users = null;
const initUserModel = async () => {
  try {
    if (users) return users;
    const sequelize = await getConnection();
    users = sequelize.define("user_model", userModel, {
      freezeTableName: true,
    });
    await users.sync({ alter: true });
    return users;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { initUserModel };
