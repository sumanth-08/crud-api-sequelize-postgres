require("dotenv").config();
const express = require("express");
const router = express.Router();
const { send } = require("../../helper/responseHelper");
const { RESPONSE } = require("../../config/global");
const { ACTIVE, AWS_URL } = require("../../config/constants.js");
const { initUserModel } = require("../../models/userModel");

// Search API
router.get("/:key", async (req, res) => {
  const seachUser = await initUserModel();
  try {
    let data = await seachUser.findOne({
      where: { isActive: true },
      $or: [
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: [`$first_name`, " ", `$last_name`],
              },
              regex: req.params.key,
              options: "i",
            },
          },
        },
        { phone: { $regex: req.params.key } },
        { email: { $regex: req.params.key, $options: "i" } },
      ],
    });

    // data = data.map((item) => {
    //   return {
    //     id: item.id,
    //     first_name: item.first_name,
    //     last_name: item.last_name,
    //     phone: item.phone,
    //     email: item.email,
    //     image: AWS_URL + item.image,
    //   };
    // });

    // if (data.length > 0) {
    return send(res, RESPONSE.SUCCESS, data);
    // } else {
    //   return send(res, RESPONSE.NO_RESULT_FOUND);
    // }
  } catch (err) {
    // return send(res, RESPONSE.UNKNOWN_ERROR);
    return res.status(400).send(err.message);
  }
});

module.exports = router;
