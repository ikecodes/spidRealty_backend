const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema({}, { timestamps: true });

articleSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
