const mongoose = require("mongoose");
const slugify = require("slugify");
const propertySchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    type: String,
    category: String,
    bathrooms: Number,
    bedrooms: Number,
    toilets: Number,
    size: Number,
    state: String,
    town: String,
    address: String,
    price: Number,
    description: String,
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
    isSold: {
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

propertySchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
const Property = mongoose.model("Property", propertySchema);

module.exports = Property;

// tourSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "guides",
//     select: "-__v -passwordChangedAt",
//   });

//   next();
// });
