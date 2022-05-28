const mongoose = require("mongoose");
const slugify = require("slugify");
const propertySchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    type: String,
    category: String,
    categorySlug: String,
    bathrooms: Number,
    bedrooms: Number,
    toilets: Number,
    size: Number,
    state: String,
    stateSlug: String,
    region: String,
    regionSlug: String,
    location: String,
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
    socialShare: [String],
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

  const spacedSlug = slugify(this.title, { replacement: "%20" });

  const twitterShare = `https://twitter.com/intent/tweet?text=${spacedSlug}&url=https://www.spidrealty.com/blog/${this.slug}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=https://www.spidrealty.com/blog/${this.slug}`;
  const facebookShare = `https://web.facebook.com/sharer.php?u=https://www.spidrealty.com/blog/${this.slug}`;
  this.socialShare = [twitterShare, linkedinShare, facebookShare];

  this.stateSlug = slugify(this.state, { lower: true });
  this.regionSlug = slugify(this.region, { lower: true });
  this.categorySlug = slugify(this.category, { lower: true });
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
