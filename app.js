require("dotenv").config();
var express = require("express");
var session = require("express-session");
var path = require("path");
var db = require("./models");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var passport = require("passport");
var helmet = require("helmet");
const cors = require("cors");
var LocalStrategy = require("passport-local").Strategy;

var fileRoutes = require("./routes/index");

var app = express();

//Use helmet to enforce HTTP header security
app.use(helmet());

//Sequelize init
db.sequelize.sync({ force: true });

//Setup cross site ability
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//Use Express sessions
app.use(session({ secret: process.env.EXPRESS_SESSION_SECRET }));

//Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

//Use Passport as middleware
app.use(passport.initialize());
app.use(passport.session());

//Passport config

app.use("/upload", fileRoutes);

module.exports = app;
