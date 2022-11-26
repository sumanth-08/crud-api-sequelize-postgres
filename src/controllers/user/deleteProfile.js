require("dotenv").config();
const express = require("express");
const router = express.Router();
const { send } = require("../../helper/responseHelper");
const { RESPONSE } = require("../../config/global");
const { NO_ACTIVE } = require("../../config/constants.js");
const { initUserModel } = require("../../models/userModel");

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleteUserDetails = await initUserModel();
    const id = req.params.id;
    await deleteUserDetails.destroy({
      where: {
        // id: id,
      },
    });
    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    // return send(res, RESPONSE.UNKNOWN_ERROR);
    return res.status(400).send(err.message);
  }
});

module.exports = router;
