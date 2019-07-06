require("dotenv").config();
var app = require("express")();
var path = require("path");
var db = require("./models");
var bodyParser = require("body-parser");
var logger = require("morgan");
var passport = require("passport");
var helmet = require("helmet");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

//Sequelize init
db.sequelize
  .authenticate()
  .then(() => console.log("MySQL connection successful."))
  .catch(err => console.error("Unable to connect to the database: ", err));
if (process.env.SEQUELIZE_FORCE_SYNC == "true") {
  db.sequelize
    .sync({ force: true })
    .then(() => console.log("Models forcibly synchronized"))
    .catch(err => console.error("Error synchronizing models: ", err));
}

require("./config/passport");

//Use helmet to enforce HTTP header security
app.use(helmet());

//Setup cross site ability
app.use(cors());

//Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

//Use Passport as middleware
app.use(passport.initialize());

require("./routes/index")(app);
require("./routes/loginUser")(app);
require("./routes/registerUser")(app);
require("./routes/loginReturningUser")(app);

app.listen(PORT, () => console.log(`Express listening on port ${PORT}`));
