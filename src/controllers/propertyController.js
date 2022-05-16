const Property = require("../models/propertyModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const User = require("../models/userModel");

module.exports = {
  /**
   * @function createProperty
   * @route /api/v1/properties
   * @method POST
   */
  createProperty: catchAsync(async (req, res, next) => {
    const property = await Property.create({
      title: req.body.title,
      type: req.body.type,
      category: req.body.category,
      bathrooms: req.body.bathrooms,
      bedrooms: req.body.bedrooms,
      toilets: req.body.toilets,
      size: req.body.size,
      state: req.body.state,
      town: req.body.town,
      address: req.body.address,
      price: req.body.price,
      description: req.body.description,
      specialFeatures: req.body.specialFeatures,
      furnished: req.body.furnished,
      newlyBuilt: req.body.newlyBuilt,
      agent: req.user.id,
    });

    await User.findByIdAndUpdate(req.user.id, {
      totalListings: req.user.totalListings + 1,
      posted: req.user.posted + 1,
    });

    res.status(200).json({
      status: "success",
      data: property,
    });
  }),
  /**
   * @function getAllProperty
   * @route /api/v1/properties
   * @method GET
   */
  getAllProperty: catchAsync(async (req, res, next) => {
    const properties = await Property.find({ isVerified: { $ne: false } });

    res.status(200).json({
      status: "success",
      data: properties,
    });
  }),
  /**
   * @function getProperty
   * @route /api/v1/properties/:id
   * @method GET
   */
  getProperty: catchAsync(async (req, res, next) => {
    const property = await Property.findOne({
      _id: req.params.id,
      isVerified: { $ne: false },
    });

    if (!property)
      return next(new AppError("No property with this Id found", 404));

    res.status(200).json({
      status: "success",
      data: property,
    });
  }),
  /**
   * @function updateProperty
   * @route /api/v1/properties/verifyProperty/:id
   * @method PATCH
   */
  verifyProperty: catchAsync(async (req, res, next) => {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    const agent = await User.findOne({ _id: updatedProperty.agent });
    agent.visibleListings = agent.visibleListings + 1;
    await agent.save();
    res.status(200).json({
      status: "success",
      data: updatedProperty,
    });
  }),
  /**
   * @function markAsSold
   * @route /api/v1/properties/markAsSold/:id
   * @method PATCH
   */
  markAsSold: catchAsync(async (req, res, next) => {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { isSold: true },
      { new: true }
    );
    const agent = await User.findOne({ _id: updatedProperty.agent });
    agent.sold = agent.sold + 1;
    await agent.save();
    res.status(200).json({
      status: "success",
      data: updatedProperty,
    });
  }),
  /**
   * @function deleteProperty
   * @route /api/v1/properties
   * @method DELETE
   */
  deleteProperty: catchAsync(async (req, res, next) => {
    await Property.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
    });
  }),
};
