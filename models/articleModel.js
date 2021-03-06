const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema(
  {
    slug: String,
    title: String,
    author: String,
    description: String,
    body: String,
    readingTime: {
      text: String,
      minutes: Number,
      time: Number,
      words: Number,
    },
    photo: String,
    photoPublicId: String,
    isFeatured: {
      type: Boolean,
      default: false,
    },
    socialShare: [String],
    shareUrl: String,
  },
  { timestamps: true }
);

articleSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });

  // create shareUrl
  this.shareUrl = `https://www.spidrealty.com/blog/${this.slug}`;

  // const spacedSlug = slugify(this.title, { replacement: "%20" });

  // const twitterShare = `https://twitter.com/intent/tweet?text=${spacedSlug}&url=https://www.spidrealty.com/blog/${this.slug}`;
  // const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=https://www.spidrealty.com/blog/${this.slug}`;
  // const facebookShare = `https://web.facebook.com/sharer.php?u=https://www.spidrealty.com/blog/${this.slug}`;

  // this.socialShare = [twitterShare, linkedinShare, facebookShare];
  next();
});
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
