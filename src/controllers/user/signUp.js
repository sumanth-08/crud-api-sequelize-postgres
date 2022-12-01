const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { send, setErrorResponseMsg } = require("../../helper/responseHelper");
const { RESPONSE } = require("../../config/global");
const { initLoginModel } = require("../../models/loginModel.js");

// Register
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginData = await initLoginModel();

    if (!email || !password) {
      return send(res, RESPONSE.REQUIRED);
    }

    const emailPattern = email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    if (!emailPattern || emailPattern.length <= 0 || email.indexOf(" ") >= 0) {
      const updated_response = setErrorResponseMsg(
        RESPONSE.INVALID_INPUT_FORMAT,
        "email"
      );
      return send(res, updated_response);
    }
    const passwordPattern = password.match(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    );
    if (
      !passwordPattern ||
      passwordPattern.length <= 0 ||
      password.indexOf(" ") >= 0
    ) {
      const updated_response = setErrorResponseMsg(
        RESPONSE.PASSWORD_LENGTH,
        "password"
      );
      return send(res, updated_response);
    }

    const oldUser = await loginData.findOne({ where: { email } });

    if (oldUser) {
      return send(res, RESPONSE.ALREADY_EXISTS);
    }

    encryptedUserPassword = await bcrypt.hash(password, 10);

    const user = await loginData.create({
      email: email,
      password: encryptedUserPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "15h",
      }
    );
    user.token = token;
    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

module.exports = router;
