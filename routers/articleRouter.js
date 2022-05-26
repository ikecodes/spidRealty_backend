const { Router } = require("express");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const ArticleController = require("../controllers/articleController");
const upload = require("../services/multer");

const router = Router();

router.route("/").get(ArticleController.getAllArticle);
router.route("/:id").get(ArticleController.getArticle);

router.use(auth);
router.use(role("admin"));
router.route("/").post(upload.single("photo"), ArticleController.createArticle);

router.route("/:id").delete(ArticleController.deleteArticle);
module.exports = router;
