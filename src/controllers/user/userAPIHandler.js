const express = require("express");
const router = express.Router();

const addProfile = require("./addProfile");
const listProfile = require("./listProfile");
const deleteProfile = require("./deleteProfile");
const updateProfile = require("./updateProfile");
const SearchProfile = require("./searchProfile");

router.use("/add_profile", addProfile);
router.use("/list_profile", listProfile);
router.use("/delete_profile", deleteProfile);
router.use("/update_profile", updateProfile);
router.use("/search_profile", SearchProfile);

module.exports = router;
