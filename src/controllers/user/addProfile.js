const express = require("express");
const router = express.Router();
const multer = require("multer");
const { s3 } = require("../../middleware/s3Uploads");
const uploads = require("../../middleware/multer");
const uuid = require("uuid").v4;
const { send, setErrorResponseMsg } = require("../../helper/responseHelper");
const { RESPONSE } = require("../../config/global");
const { initUserModel } = require("../../models/userModel");

// POST
router.post("/", async (req, res, next) => {
  uploads(req, res, function (err) {
    if (!req.file) {
      return send(res, RESPONSE.FILE_ERRROR);
    } else if (err instanceof multer.MulterError) {
      return send(res, RESPONSE.FILE_TOO_LARGE);
    } else if (err) {
      return res.status(400).send(err.message);
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}`, // -${req.file.originalname}
      Body: req.file.buffer,
    };
    s3.upload(params, async (error, data) => {
      if (error) {
        // send(res, RESPONSE.UNKNOWN_ERROR);
        return res.status(400).send(error.message);
      }

      try {
        let { first_name, last_name, phone, email } = req.body;
        const userModel = await initUserModel();

        const addData = await userModel.create({
          first_name: first_name,
          last_name: last_name,
          phone: phone,
          email: email,
          image: data.Key,
        });

        const phoneNumberPattern = phone.match(/^\d{10}$/); // /^\d{10}$/   /^\+[0-9]+$/g
        if (
          !phoneNumberPattern ||
          phoneNumberPattern.length <= 0 ||
          phone.indexOf(" ") >= 0
        ) {
          const updated_response = setErrorResponseMsg(
            RESPONSE.INVALID_INPUT_FORMAT,
            "phone"
          );
          return send(res, updated_response);
        }

        //   email validation
        const emailPattern = email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        if (
          !emailPattern ||
          emailPattern.length <= 0 ||
          email.indexOf(" ") >= 0
        ) {
          const updated_response = setErrorResponseMsg(
            RESPONSE.INVALID_INPUT_FORMAT,
            "email"
          );
          return send(res, updated_response);
        }

        const oldPhone = await userModel.findOne({ where: { phone } });
        const oldEmail = await userModel.findOne({ where: { email } });

        if (oldPhone) {
          return send(res, RESPONSE.PHONE_NO_ALREADY_EXISTS);
        }
        if (oldEmail) {
          return send(res, RESPONSE.EMAIL_ALREADY_EXISTS);
        }

        // return send(res, RESPONSE.SUCCESS);
        return res.status(200).send(addData);
      } catch (err) {
        // return send(res, RESPONSE.UNKNOWN_ERROR);
        return res.status(400).send(err.message);
      }
    });
  });
});

module.exports = router;
