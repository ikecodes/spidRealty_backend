const { Router } = require("express");
const auth = require("../middlewares/auth");
const UserController = require("../controllers/userController");
const upload = require("../services/multer");

const router = Router();

router.route("/").post(upload.single("companyCac"), UserController.signup);
router.route("/session").post(UserController.login);

module.exports = router;
