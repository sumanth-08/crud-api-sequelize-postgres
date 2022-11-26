const express = require("express");
const router = express.Router();

const addProfile = require("./addProfile");
const listProfile = require("./listProfile");
const deleteProfile = require("./deleteProfile");
const updateProfile = require("./updateProfile");

router.use("/add_profile", addProfile);
router.use("/list_profile", listProfile);
router.use("/delete_profile", deleteProfile);
router.use("/update_profile", updateProfile);

module.exports = router;
