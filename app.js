require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var passport = require("passport");
var helmet = require("helmet");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const B2 = require("backblaze-b2");
const cors = require("cors");

var expressRoutes = require("./routes/index");

var app = express();

//Use helmet to enforce HTTP header security
app.use(helmet());

//Setup cross site ability
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

//Initialize B2 Bucket
const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY
});

async function GetBucket() {
  try {
    await b2.authorize();
    let response = await b2.getBucket({ bucketName: "radiostar" });
    console.log(response.data);
  } catch (err) {
    console.log("Error getting bucket: ", err);
  }
}

GetBucket();

//Initialize Passport
app.use(passport.initialize());

/* 
Start Passport Configuration for Google OAuth 2.0 Authentication
*/
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "update later"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        return done(err, user);
      });
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);

/*
  End Passport Configuration
  */

app.use("/", expressRoutes);

module.exports = app;
