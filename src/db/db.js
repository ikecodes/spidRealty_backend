const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

module.exports = () => {
  const localDb = process.env.LOCAL_DATABASE;
  mongoose
    .connect(localDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("successfully connected to database 😁");
    });
};
