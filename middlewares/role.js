const AppError = require("../helpers/appError");
const role = (...roles) => {
  return (req, res, next) => {
    //roles is an array ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        // 403 forbiden
        new AppError("you do no have permission to perform this action", 403)
      );
    }
    next();
  };
};

module.exports = role;
