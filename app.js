const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const errorHandler = require("./middlewares/errorHandler");
const userRouter = require("./routers/userRouter");
const propertyRouter = require("./routers/propertyRouter");
const articleRouter = require("./routers/articleRouter");
const enquiryRouter = require("./routers/enquiryRouter");

const app = express();

app.set("veiw engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);
app.use(xss());
app.use(cors());
app.use(mongoSanitize());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/enquiries", enquiryRouter);

// home
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome to Spid Realty App",
  });
});

app.use(errorHandler);

module.exports = app;
