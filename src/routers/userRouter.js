const { Router } = require("express");
const auth = require("../middlewares/auth");
const UserController = require("../controllers/userController");

const router = Router();

router.route("/").post(UserController.signup);
router.route("/session").post(UserController.login);

module.exports = router;
