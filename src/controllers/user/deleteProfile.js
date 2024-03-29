require("dotenv").config();
const express = require("express");
const router = express.Router();
const { send } = require("../../helper/responseHelper");
const { RESPONSE } = require("../../config/global");
const { NO_ACTIVE } = require("../../config/constants.js");
const { initUserModel } = require("../../models/userModel");
const authenticate = require("../../middleware/authentication");

// DELETE
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const deleteUserDetails = await initUserModel();
    const id = req.params.id;
    let status = {
      isActive: false,
    };
    let selector = {
      where: { id: id },
    };
    await deleteUserDetails.update(status, selector);
    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

module.exports = router;
