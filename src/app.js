const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(cors());
app.use(mongoSanitize());

app.use("/", (req, res) => {
  console.log("hitting");
});

// app.use(errorHandler);

module.exports = app;
