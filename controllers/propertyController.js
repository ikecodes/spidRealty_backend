const Property = require("../models/propertyModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const User = require("../models/userModel");
const cloudinary = require("../services/cloudinary");

module.exports = {
  /**
   * @function createProperty
   * @route /api/v1/properties
   * @method POST
   */
  createProperty: catchAsync(async (req, res, next) => {
    const imagesPromises = req.files.map(async (file) => {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        null,
        { folder: "Property" }
      );
      return {
        original: secure_url,
        thumbnail: secure_url,
        publicId: public_id,
      };
    });
    const images = await Promise.all(imagesPromises);

    const property = await Property.create({
      title: req.body.title,
      type: req.body.type,
      category: req.body.category,
      bathrooms: req.body.bathrooms,
      bedrooms: req.body.bedrooms,
      toilets: req.body.toilets,
      size: req.body.size,
      state: req.body.state,
      region: req.body.region,
      location: req.body.location,
      price: req.body.price,
      description: req.body.description,
      specialFeatures: req.body.specialFeatures,
      furnished: req.body.furnished,
      newlyBuilt: req.body.newlyBuilt,
      images: images,
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
   * @function getAllPropertyByUser
   * @route /api/v1/properties/getAllPropertyByUser
   * @method GET
   */
  getAllPropertyByUser: catchAsync(async (req, res, next) => {
    const properties = await Property.find({
      agent: req.user._id,
    });
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
    const property = await Property.findOne({ _id: req.params.id });
    const deletePromises = property.images.map(async (image) => {
      await cloudinary.uploader.destroy(image.publicId, null, {
        folder: "Property",
      });
    });
    await Promise.all(deletePromises);
    await Property.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
    });
  }),
};
