const express = require("express");
const userAPIHandler = require("./src/controllers/user/userAPIHandler");

module.exports = (app) => {
  app.use(express.json());

  app.use("/api/user", userAPIHandler);
};
