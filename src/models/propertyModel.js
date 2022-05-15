const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    category: String,
    bathrooms: Number,
    bedrooms: Number,
    toilets: Number,
    size: Number,
    state: String,
    town: String,
    street: String,
    price: Number,
    description: Number,
    specialFeatures: Array,
    furnished: Boolean,
    newlyBuilt: Boolean,
    images: [
      {
        publicId: String,
        original: String,
        thumbnail: String,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    agent: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;

// tourSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "guides",
//     select: "-__v -passwordChangedAt",
//   });

//   next();
// });
