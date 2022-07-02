const Enquiry = require("../models/enquiryModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");

module.exports = {
  /**
   * @function getEnquiries
   * @route /api/v1/enquiries
   * @method GET
   */
  getEnquiries: catchAsync(async (req, res, next) => {
    const enquiries = await Enquiry.find();
    res.status(200).json({
      status: "success",
      data: enquiries,
    });
  }),

  /**
   * @function createEnquiry
   * @route /api/v1/enquiries
   * @method POST
   */
  createEnquiry: catchAsync(async (req, res, next) => {
    const enquiry = await Enquiry.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      property: req.body.propertyId,
    });
    res.status(200).json({
      status: "success",
      data: enquiry,
    });
  }),
  /**
   * @function deleteEnquiry
   * @route /api/v1/enquiries/:id
   * @method DELETE
   */
  deleteEnquiry: catchAsync(async (req, res, next) => {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
    });
  }),
};
