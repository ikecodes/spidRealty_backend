const multer = require("multer");
const path = require("path");
const AppError = require("../helpers/appError");

// Multer config
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(
        new AppError("this is not an image! please upload an image", 400),
        false
      );
      return;
    }
    cb(null, true);
  },
});

module.exports = upload;
