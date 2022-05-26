const { Router } = require("express");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const PropertyController = require("../controllers/propertyController");
const upload = require("../services/multer");
const router = Router();

router.route("/").get(PropertyController.getAllProperty);
router.route("/:id").get(PropertyController.getProperty);

router.use(auth);
router
  .route("/")
  .post(upload.array("images"), PropertyController.createProperty);
router
  .route("/getAllPropertyByUser")
  .get(PropertyController.getAllPropertyByUser);
router.route("/:id").delete(PropertyController.deleteProperty);

router.use(role("admin"));
router.route("/verifyProperty/:id").patch(PropertyController.verifyProperty);
router.route("/markAsSold/:id").patch(PropertyController.markAsSold);
module.exports = router;
