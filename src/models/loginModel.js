const { DataTypes } = require("sequelize");
const { getConnection } = require("../helper/databaseConnection");

const loginModel = {
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: new DataTypes.STRING(200),
    allowNull: false,
  },
  password: {
    type: new DataTypes.STRING(200),
    allowNull: false,
  },
};

let login = null;
const initLoginModel = async () => {
  try {
    if (login) return login;
    const sequelize = await getConnection();
    login = sequelize.define("login_model", loginModel, {
      freezeTableName: true,
    });
    await login.sync({ alter: true });
    return login;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { initLoginModel };
