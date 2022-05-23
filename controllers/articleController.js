const Article = require("../models/articleModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const cloudinary = require("../services/cloudinary");

module.exports = {
  /**
   * @function createArticle
   * @route /api/v1/articles
   * @method POST
   */
  createArticle: catchAsync(async (req, res, next) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      null,
      { folder: "Article" }
    );

    const article = await Article.create({
      title: req.body.title,
      description: req.body.description,
      photo: secure_url,
      photoPublicId: public_id,
    });

    res.status(200).json({
      status: "success",
      data: article,
    });
  }),
  /**
   * @function getAllArticle
   * @route /api/v1/articles
   * @method GET
   */
  getAllArticle: catchAsync(async (req, res, next) => {
    const articles = await Article.find();

    res.status(200).json({
      status: "success",
      data: articles,
    });
  }),
  /**
   * @function getArticle
   * @route /api/v1/articles/:id
   * @method GET
   */
  getArticle: catchAsync(async (req, res, next) => {
    const article = await Article.findOne({ _id: req.params.id });

    if (!article)
      return next(new AppError("No article with this id found", 404));
    res.status(200).json({
      status: "success",
      data: article,
    });
  }),
  /**
   * @function deleteArticle
   * @route /api/v1/articles
   * @method DELETE
   */
  deleteArticle: catchAsync(async (req, res, next) => {
    const article = await Article.findOne({ _id: req.params.id });

    await cloudinary.uploader.destroy(article.photoPublicId, null, {
      folder: "Article",
    });

    await Article.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
    });
  }),
};
