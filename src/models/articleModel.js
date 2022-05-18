const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    description: String,
    photo: String,
    photoPublicId: String,
  },
  { timestamps: true }
);

articleSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
