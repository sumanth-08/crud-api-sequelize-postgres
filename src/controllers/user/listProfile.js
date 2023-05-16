require("dotenv").config();
const express = require("express");
const router = express.Router();
const { send } = require("../../helper/responseHelper");
const { RESPONSE } = require("../../config/global");
const { ACTIVE, AWS_URL } = require("../../config/constants.js");
const { initUserModel } = require("../../models/userModel");
const authenticate = require("../../middleware/authentication");

// GET
router.get("/", authenticate, async (req, res) => {
  try {
    // let page = Number(req.query.page);
    // page = page ? page : 0;
    // let limit = parseInt(req.query.limit);
    // const result = {};

    let page = Number(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;
    
    const userDetails = await initUserModel();

    let receive = await userDetails.findAll({
      where: { isActive: true },
      order: ["id"],
       limit: limit,
       offset: offset
    });

    receive = receive.map((item) => {
      return {
        index: ++page,
        id: item.id,
        first_name: item.first_name,
        last_name: item.last_name,
        phone: item.phone,
        email: item.email,
        image: AWS_URL + item.image,
      };
    });

    if (receive.length > 0) {
      return send(res, RESPONSE.SUCCESS, receive);
    } else {
      return send(res, RESPONSE.NO_RESULT_FOUND);
    }
  } catch (err) {
    // return send(res, RESPONSE.UNKNOWN_ERROR);
    return res.send(err.stack);
  }
});

module.exports = router;
