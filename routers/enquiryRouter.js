const { Router } = require("express");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const EnquiryController = require("../controllers/enquiryController");
const router = Router();

router.route("/").post(EnquiryController.createEnquiry);

router.use(auth);
router.use(role("admin"));
router.route("/").get(EnquiryController.getEnquiries);
router.route("/:id").delete(EnquiryController.deleteEnquiry);
module.exports = router;
