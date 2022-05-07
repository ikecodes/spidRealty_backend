const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const createAndSendToken = require("../helpers/createAndSendToken");
const Mail = require("../helpers/sendEmail");
const cloudinary = require("../services/cloudinary");

module.exports = {
  /**
   * @function signup
   * @route /api/user/signup
   * @method POST
   */
  signup: catchAsync(async (req, res, next) => {
    let companyCac = null;
    let CacPublicId = null;

    const { email, phone } = req.body;
    const existingUserWithEmail = await User.findOne({ email: email });
    if (existingUserWithEmail)
      return next(new AppError("User with email already exists", 401));
    const existingUserWithPhone = await User.findOne({ phone: phone });
    if (existingUserWithPhone)
      return next(new AppError("User with phone number already exists", 401));

    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          upload_preset: "agent",
        }
      );
      companyCac = secure_url;
      CacPublicId = public_id;
    }

    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      companyInfo: req.body.companyInfo,
      CacPublicId: CacPublicId,
      companyCac: companyCac,
      password: req.body.password,
      role: req.body.role,
    });
    res.status(200).json({
      status: "success",
      user: newUser,
    });
  }),

  /**
   * @function login
   * @route /api/user/session
   * @method POST
   */
  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("please provide email and password!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("incorrect email or password!", 401));
    }
    createAndSendToken(user, 200, res);
  }),

  /**
   * @function login
   * @route /api/user/sendEmail
   * @method POST
   */
  sendEmail: catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }
    const token = user.createEmailConfirmToken();
    await user.save({ validateBeforeSave: false });
    const options = {
      mail: user.email,
      subject: "Welcome to Spid Realty!",
      email: "../email/welcome.ejs",
      firtname: user.firstName,
      token: token,
    };
    await Mail(options);
    res.status(200).json({
      status: "success",
      message: "token sent to mail",
    });
  }),
};
