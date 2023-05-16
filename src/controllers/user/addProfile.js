const express = require("express");
const router = express.Router();
const multer = require("multer");
const { s3 } = require("../../middleware/s3Uploads");
const uploads = require("../../middleware/multer");
const uuid = require("uuid").v4;
const { send, setErrorResponseMsg } = require("../../helper/responseHelper");
const { RESPONSE } = require("../../config/global");
const { initUserModel } = require("../../models/userModel");
const authenticate = require("../../middleware/authentication");

// POST
router.post("/", authenticate, async (req, res) => {
  uploads(req, res, function (err) {
    if (!req.file) {
      return send(res, RESPONSE.FILE_ERRROR);
    } else if (err instanceof multer.MulterError) {
      return send(res, RESPONSE.FILE_TOO_LARGE);
    } else if (err) {
      return send(res, RESPONSE.UNKNOWN_ERROR);
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}`, // -${req.file.originalname}
      Body: req.file.buffer,
    };
    s3.upload(params, async (error, data) => {
      if (error) {
        send(res, RESPONSE.UNKNOWN_ERROR);
      }

      try {
        let { first_name, last_name, phone, email, blocked_user_id } = req.body;
        const userModel = await initUserModel();

        if (!req.body.first_name) {
          return send(res, RESPONSE.REQUIRED);
        } else if (!req.body.last_name) {
          return send(res, RESPONSE.REQUIRED);
        } else if (!req.body.phone) {
          return send(res, RESPONSE.REQUIRED);
        } else if (!req.body.email) {
          return send(res, RESPONSE.REQUIRED);
        }

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

        await userModel.create({
          first_name: first_name,
          last_name: last_name,
          phone: phone,
          email: email,
          image: data.Key,
          blocked_user_id: [blocked_user_id]
        });

        return send(res, RESPONSE.SUCCESS);
      } catch (err) {
        return res.send(err.stack);
        // return send(res, RESPONSE.UNKNOWN_ERROR);
      }
    });
  });
});

module.exports = router;
