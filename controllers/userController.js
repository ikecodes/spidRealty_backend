const crypto = require("crypto");
const User = require("../models/userModel");
const Article = require("../models/articleModel");
const Property = require("../models/propertyModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const createAndSendToken = require("../helpers/createAndSendToken");
const Mail = require("../helpers/sendEmail");
const cloudinary = require("../services/cloudinary");

module.exports = {
  /**
   * @function getStats
   * @route /api/v1/users/getStats
   * @method GET
   */
  getStats: catchAsync(async (req, res, next) => {
    const userPromise = User.countDocuments();
    const propertyPromise = Property.countDocuments();
    const articlePromise = Article.countDocuments();

    const [totalUsers, totalProperties, totalArticles] = await Promise.all([
      userPromise,
      propertyPromise,
      articlePromise,
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalUsers,
        totalProperties,
        totalArticles,
      },
    });
  }),
  /**
   * @function getAllUsers
   * @route /api/v1/users
   * @method GET
   */
  getAllUsers: catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: users,
    });
  }),
  /**
   * @function getUser
   * @route /api/v1/users/:id
   * @method GET
   */
  getUser: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: user,
    });
  }),

  /**
   * @function verifyUser
   * @route /api/v1/users/verifyUser
   * @method PATCH
   */
  verifyUser: catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }),
  /**
   * @function deactivateUser
   * @route /api/v1/users/deactivateUser
   * @method PATCH
   */
  activeStatus: catchAsync(async (req, res, next) => {
    let updatedUser;
    const user = await User.findOne({ _id: req.params.id });
    if (user.active === true) {
      user.active = false;
    } else {
      user.active = true;
    }
    await user.save();
    res.status(200).json({
      status: "success",
      data: user,
    });
  }),
};
