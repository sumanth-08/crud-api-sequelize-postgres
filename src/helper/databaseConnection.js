const { Sequelize } = require("sequelize");
const { DATABASE, HOST, USER_NAME, PASSWORD } = require("../config/constants");

let connection = null;
// connecting to db
const getConnection = async () => {
  if (!connection) {
    connection = new Sequelize({
      database: DATABASE,
      host: HOST,
      username: USER_NAME,
      password: PASSWORD,
      port: "5432",
      dialect: "postgres",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: false,
    });
  }
  return connection;
};

module.exports = { getConnection };
