const { Router } = require("express");
const auth = require("../middlewares/auth");
const UserController = require("../controllers/userController");
const upload = require("../services/multer");

const router = Router();

router.route("/").post(upload.single("companyCac"), UserController.signup);
router.route("/session").post(UserController.login);
router.route("/sendEmail").post(UserController.sendEmail);
router.route("/confirmEmail").post(UserController.confirmEmail);
router.route("/forgotPassword").post(UserController.forgotPassword);
router.route("/confirmResetToken").post(UserController.confirmResetToken);
router.route("/resetPassword").patch(UserController.resetPassword);

router.use(auth);

router.route("/updateMe").patch(UserController.updateMe);
router
  .route("/updatePhoto")
  .patch(upload.single("photo"), UserController.updatePhoto);
router.route("/updatePassword").patch(UserController.updatePassword);

module.exports = router;
