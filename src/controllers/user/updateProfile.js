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

// PUT
router.put("/:id", async (req, res) => {
  uploads(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return send(res, RESPONSE.FILE_TOO_LARGE);
    } else if (err) {
      return send(res, RESPONSE.UNKNOWN_ERROR);
    }
    try {
      const id = req.params.id;
      let { first_name, last_name, phone, email } = req.body;
      const upadteUser = initUserModel();

      const updatedData = await upadteUser.update(
        {
          first_name: first_name,
          last_name: last_name,
          phone: phone,
          email: email,
        },
        {
          where: {
            id: id,
          },
        }
      );

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
      const options = { new: true };

      updatedData.update({
        where: { id: id },
      });

      await upadteUser.update(
        req.body,
        { where: { id: id } }
        // updatedData,
        // options
      );
      //   return send(res, RESPONSE.SUCCESS);
      res.status(400).send(updatedData);
    } catch (err) {
      //   return send(res, RESPONSE.UNKNOWN_ERROR);
      return res.status(400).send(err.message);
    }
  });
});

module.exports = router;
