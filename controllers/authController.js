const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const createAndSendToken = require("../helpers/createAndSendToken");
const Mail = require("../helpers/sendEmail");
const cloudinary = require("../services/cloudinary");

module.exports = {
  /**
   * @function signup
   * @route /api/v1/users/signup
   * @method POST
   */
  signup: catchAsync(async (req, res, next) => {
    let companyCac = null;
    let companyCacPublicId = null;

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
        null,
        { folder: "CAC" }
      );
      companyCac = secure_url;
      companyCacPublicId = public_id;
    }

    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      companyInfo: req.body.companyInfo,
      companyCacPublicId: companyCacPublicId,
      companyCac: companyCac,
      password: req.body.password,
      role: req.body.role,
    });
    res.status(200).json({
      status: "success",
      data: newUser,
    });
  }),

  /**
   * @function sendEmail
   * @route /api/v1/users/sendEmail
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
    try {
      await Mail(options);

      res.status(200).json({
        status: "success",
        message: "token sent to mail",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
  }),

  /**
   * @function confirmEmail
   * @route /api/v1/users/confirmEmail
   * @method POST
   */
  confirmEmail: catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      emailConfirmToken: req.body.token,
      email: req.body.email,
    });
    if (!user) {
      return next(new AppError("token is invalid or has expired", 400));
    }
    user.emailConfirmToken = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Token confirmation successful, you can now login",
    });
  }),

  /**
   * @function login
   * @route /api/v1/users/session
   * @method POST
   */
  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("please provide email and password!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError("incorrect email or password!", 401));

    createAndSendToken(user, 200, res);
  }),
  /**
   * @function me
   * @route /api/v1/users/getMe
   * @method POST
   */
  getMe: catchAsync(async (req, res, next) => {
    const user = await User.findOne({ id: req.user.id });
    if (!user) return next(new AppError("Please login to gain access", 403));

    res.status(200).json({
      status: "success",
      data: user,
    });
  }),

  /**
   * @function forgotPassword
   * @route /api/v1/users/forgotPassword
   * @method POST
   */
  forgotPassword: catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `https://www.spidrealty.com/reset-password?${resetToken}`;

    const options = {
      mail: user.email,
      subject: "Password Reset",
      email: "../email/forgotPassword.ejs",
      firtname: user.firstname,
      token: resetUrl,
    };
    try {
      await Mail(options);
      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
  }),

  /**
   * @function resetPassword
   * @route /api/v1/users/resetPassword
   * @method PATCH
   */
  resetPassword: catchAsync(async (req, res, next) => {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedPassword,
      passwordResetExpires: { $gt: Date.now() },
    });

    //2) set new password id token !expired and user still exists
    if (!user) {
      return next(new AppError("token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "password reset successful",
    });
  }),

  /**
   * @function updateMe
   * @route /api/v1/users/updateMe
   * @method PATCH
   */
  updateMe: catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      next(
        new AppError(
          "this route is not for password update, please /updateMyPassword",
          400
        )
      );
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }),

  /**
   * @function updatePhoto
   * @route /api/v1/users/updatePhoto
   * @method PATCH
   */
  updatePhoto: catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      next(
        new AppError(
          "this route is not for password update, please /updateMyPassword",
          400
        )
      );
    }
    if (req.user.photoPublicId)
      await cloudinary.uploader.destroy(req.user.photoPublicId);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      null,
      {
        folder: "Profile",
      }
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        photo: secure_url,
        photoPublicId: public_id,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }),
  /**
   * @function updatePassword
   * @route /api/v1/users/updatePassword
   * @method PATCH
   */
  updatePassword: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("your current password is incorrect", 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Your password has been updated",
    });
  }),

  /**
   * @function uploadId
   * @route /api/v1/users/uploadId
   * @method PATCH
   */
  uploadId: catchAsync(async (req, res, next) => {
    if (req.user.identityCardPublicId)
      await cloudinary.uploader.destroy(req.user.identityCardPublicId);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      null,
      {
        folder: "ID",
      }
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        identityCard: secure_url,
        identityCardPublicId: public_id,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }),
};
