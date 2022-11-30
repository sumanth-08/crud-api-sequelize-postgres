const jwt = require("jsonwebtoken");
const { RESPONSE } = require("../../src/config/global");
const { send } = require("../../src/helper/responseHelper");
require("dotenv").config();

const config = process.env;

const authenticate = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["autherization"];

  if (!token) {
    return send(res, RESPONSE.USER_NOT_FOUND);
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return send(res, RESPONSE.INVALID_TOKEN);
  }
  return next();
};

module.exports = authenticate;
