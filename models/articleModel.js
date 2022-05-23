const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    description: String,
    photo: String,
    photoPublicId: String,
    socialShare: [String],
  },
  { timestamps: true }
);

articleSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });

  const spacedSlug = slugify(this.title, { replacement: "%20" });

  const twitterShare = `https://twitter.com/intent/tweet?text=${spacedSlug}&url=https://www.spidrealty.com/blog/${this.slug}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=https://www.spidrealty.com/blog/${this.slug}`;
  const facebookShare = `https://web.facebook.com/sharer.php?u=https://www.spidrealty.com/blog/${this.slug}`;

  this.socialShare = [twitterShare, linkedinShare, facebookShare];
  next();
});
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
