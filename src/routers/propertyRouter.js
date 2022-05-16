const { Router } = require("express");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const PropertyController = require("../controllers/propertyController");
const router = Router();

router.use(auth);

router
  .route("/")
  .get(PropertyController.getAllProperty)
  .post(PropertyController.createProperty);
router.route("/:id").get(PropertyController.getProperty);
router.route("/:id").delete(PropertyController.deleteProperty);

router.use(role("admin"));
router.route("/verifyProperty/:id").patch(PropertyController.verifyProperty);
router.route("/markAsSold/:id").patch(PropertyController.markAsSold);
module.exports = router;
