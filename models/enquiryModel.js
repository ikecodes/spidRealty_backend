const mongoose = require("mongoose");
const enquirySchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
    },
  },
  {
    timestamps: true,
  }
);

enquirySchema.pre(/^find/, function (next) {
  this.populate("property");
  next();
});
const Enquiry = mongoose.model("Enquiry", enquirySchema);

module.exports = Enquiry;
