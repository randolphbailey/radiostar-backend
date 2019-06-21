require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var passport = require("passport");
var helmet = require("helmet");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

//Use helmet to enforce HTTP header security
app.use(helmet());

//Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

//Initialize Passport
app.use(passport.initialize());

//Configure Passport for Google OAuth 2.0 Authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "update later"
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        return cb(err, user);
      });
    }
  )
);

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
