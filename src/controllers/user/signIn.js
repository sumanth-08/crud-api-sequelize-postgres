const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { send } = require("../../helper/responseHelper");
const { RESPONSE } = require("../../config/global");
const { initLoginModel } = require("../../models/loginModel");

// Login
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginData = await initLoginModel();

    if (!email || !password) {
      return send(res, RESPONSE.REQUIRED);
    }

    const user = await loginData.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "15h",
        }
      );

      user.token = token;

      return send(res, RESPONSE.SUCCESS, {
        email: email,
        access_token: token,
      });
    }

    return send(res, RESPONSE.NOT_MATCH);
  } catch (err) {
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

module.exports = router;
