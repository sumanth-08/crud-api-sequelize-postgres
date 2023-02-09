const express = require("express");
const router = express.Router();

const addProfile = require("./addProfile");
const listProfile = require("./listProfile");
const deleteProfile = require("./deleteProfile");
const updateProfile = require("./updateProfile");
const searchProfile = require("./searchProfile");
const signUp = require("./signUp");
const signIn = require("./signIn");

router.use("/add_profile", addProfile);
router.use("/list_profile", listProfile);
router.use("/delete_profile", deleteProfile);
router.use("/update_profile", updateProfile);
router.use("/search_profile", searchProfile);
router.use("/sign_up", signUp);
router.use("/sign_in", signIn);

module.exports = router;
