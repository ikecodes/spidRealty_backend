const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const createAndSendToken = require("../helpers/createAndSendToken");

module.exports = {
  signup: catchAsync(async (req, res, next) => {
    const { email, phone } = req.body;
    const existingUser = await User.findOne({ email: email, phone: phone });
    if (existingUser)
      return next(
        new AppError("User with email or phone number already exists", 401)
      );
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      companyInfo: req.body.companyInfo,
      companyCac: req.body.companyCac,
      password: req.body.password,
      role: req.body.role,
    });
    res.status(200).json({
      status: "success",
      user: newUser,
    });
  }),

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
};
