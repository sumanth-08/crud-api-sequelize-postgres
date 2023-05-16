require("dotenv").config();
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { s3 } = require("../../middleware/s3Uploads");
const uploads = require("../../middleware/multer");
const uuid = require("uuid").v4;
const { send, setErrorResponseMsg } = require("../../helper/responseHelper");
const { RESPONSE } = require("../../config/global");
const { initUserModel } = require("../../models/userModel");
const { where } = require("sequelize");
const authenticate = require("../../middleware/authentication");

// PUT
router.put("/:id", authenticate, async (req, res) => {
  uploads(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return send(res, RESPONSE.FILE_TOO_LARGE);
    } else if (err) {
      return send(res, RESPONSE.UNKNOWN_ERROR);
    }

    try {
      const userModel = await initUserModel();
      const id = req.params.id;
      const updatedData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
        blocked_user_id: [...req.body.blocked_user_id]

      };

      if (req.file) {
        const { Key } = await s3
          .upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${uuid()}`,
            Body: req.file.buffer,
          })
          .promise();

        updatedData.image = Key;
      }

      // const requestBody = req.body;
      // let phone = requestBody.phone;
      // let email = requestBody.email;
      // const phoneNumberPattern = phone.match(/^\d{10}$/); // /^\d{10}$/   /^\+[0-9]+$/g
      // if (
      //   !phoneNumberPattern ||
      //   phoneNumberPattern.length <= 0 ||
      //   phone.indexOf(" ") >= 0
      // ) {
      //   const updated_response = setErrorResponseMsg(
      //     RESPONSE.INVALID_INPUT_FORMAT,
      //     "phone"
      //   );
      //   return send(res, updated_response);
      // }

      // // email validation
      // const emailPattern = email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
      // if (
      //   !emailPattern ||
      //   emailPattern.length <= 0 ||
      //   email.indexOf(" ") >= 0
      // ) {
      //   const updated_response = setErrorResponseMsg(
      //     RESPONSE.INVALID_INPUT_FORMAT,
      //     "email"
      //   );
      //   return send(res, updated_response);
      // }

      // if (!req.body.first_name) {
      //   return send(res, RESPONSE.REQUIRED);
      // } else if (!req.body.last_name) {
      //   return send(res, RESPONSE.REQUIRED);
      // } else if (!req.body.phone) {
      //   return send(res, RESPONSE.REQUIRED);
      // } else if (!req.body.email) {
      //   return send(res, RESPONSE.REQUIRED);
      // }

      let selector = {
        where: { id: id },
      };

      await userModel.update(updatedData, selector);
      return send(res, RESPONSE.SUCCESS);
    } catch (err) {
      // return send(res, RESPONSE.UNKNOWN_ERROR);
      return res.send(err.stack);

    }
  });
});

module.exports = router;
