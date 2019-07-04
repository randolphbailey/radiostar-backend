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
const PORT = process.env.PORT || 3000;

//Sequelize init
db.sequelize
  .authenticate()
  .then(() => console.log("MySQL connection successful."))
  .catch(err => console.error("Unable to connect to the database: ", err));
if (process.env.SEQUELIZE_FORCE_SYNC) {
  db.sequelize
    .sync({ force: true })
    .then(() => console.log("Models forcibly synchronized"))
    .catch(err => console.error("Error synchronizing models: ", err));
}

var app = express();

require("./config/passport");

//Use helmet to enforce HTTP header security
app.use(helmet());

//Setup cross site ability
app.use(cors());

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

require("./routes/index")(app);
require("./routes/loginUser")(app);
require("./routes/registerUser")(app);

app.listen(PORT, () => console.log(`Express listening on port ${PORT}`));
