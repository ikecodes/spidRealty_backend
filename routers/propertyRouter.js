const { Router } = require("express");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const PropertyController = require("../controllers/propertyController");
const upload = require("../services/multer");
const router = Router();

router.route("/").get(PropertyController.getAllProperty);
router
  .route("/getAllPropertyByUser")
  .get(auth, PropertyController.getAllPropertyByUser);
router.route("/getSimilarProperty").get(PropertyController.getSimilarProperty);
router.route("/:id").get(PropertyController.getProperty);

router.use(auth);
router
  .route("/")
  .post(upload.array("images"), PropertyController.createProperty);
router.route("/:id").delete(PropertyController.deleteProperty);

router.use(role("admin"));
router
  .route("/admin/getAllPropertyByAdmin")
  .get(PropertyController.getAllPropertyByAdmin);
router.route("/:id").patch(PropertyController.updateProperty);
router.route("/verifyProperty/:id").patch(PropertyController.verifyProperty);
router.route("/markAsSold/:id").patch(PropertyController.markAsSold);
module.exports = router;
