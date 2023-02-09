require("dotenv").config();
const express = require("express");
const router = express.Router();
const { send } = require("../../helper/responseHelper");
const { RESPONSE } = require("../../config/global");
const { ACTIVE, AWS_URL } = require("../../config/constants.js");
const { initUserModel } = require("../../models/userModel");
const { Op, Sequelize } = require("sequelize");
const authenticate = require("../../middleware/authentication");

// Search API
router.get("/:key", authenticate, async (req, res) => {
  const seachUser = await initUserModel();
  try {
    let data = await seachUser.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn(
              "concat",
              Sequelize.col("first_name"),
              " ",
              Sequelize.col("last_name")
            ),
            {
              [Op.iLike]: "%" + req.params.key + "%",
            }
          ),
          { phone: { [Op.like]: "%" + req.params.key + "%" } },
          { email: { [Op.iLike]: "%" + req.params.key + "%" } },
        ],
      },
    });

    data = data.map((item) => {
      return {
        id: item.id,
        first_name: item.first_name,
        last_name: item.last_name,
        phone: item.phone,
        email: item.email,
        image: AWS_URL + item.image,
      };
    });

    if (data.length > 0) {
      return send(res, RESPONSE.SUCCESS, data);
    } else {
      return send(res, RESPONSE.NO_RESULT_FOUND);
    }
  } catch (err) {
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

module.exports = router;
