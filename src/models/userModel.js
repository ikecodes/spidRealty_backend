const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please tell us your first name"],
    },
    lastName: {
      type: String,
      require: [true, "Please tell us your last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    address: String,
    companyInfo: String,
    companyCacPublicId: String,
    companyCac: String,
    photoPublicId: String,
    photo: {
      type: String,
      default:
        "https://res.cloudinary.com/djwxy9aol/image/upload/v1651972394/fuixnwpb8lq78zazftsn.png",
    },
    identityCard: String,
    identityCardPublicId: String,
    role: {
      type: String,
      enum: ["agent", "investor", "buyer", "admin"],
      default: "agent",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    totalListings: {
      type: Number,
      default: 0,
    },
    visibleListings: {
      type: Number,
      default: 0,
    },
    posted: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    propertyPromotions: {
      type: Number,
      default: 0,
    },
    emailConfirmToken: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      // select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// userSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createEmailConfirmToken = function () {
  const confirmToken = Math.floor(100000 + Math.random() * 900000);
  this.emailConfirmToken = confirmToken;
  return confirmToken;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
