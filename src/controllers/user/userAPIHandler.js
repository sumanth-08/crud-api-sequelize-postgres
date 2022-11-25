const express = require("express");
const router = express.Router();

const addProfile = require("./addProfile");

router.use("/add_profile", addProfile);

module.exports = router;
