const multer = require("multer");

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "");
  },
});

fileFilter = (req, file, cb, res) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/heic"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error(".JEG/.PNG/.JPEG/.HEIC file are only allwored"));
  }
};

const maxSize = 1024 * 1024 * 2;

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter,
});
const uploads = upload.single("image");

module.exports = uploads;
