var jwt = require("jsonwebtoken");
var passport = require("passport");
var jwtSecret = require("../config/jwtConfig");
const db = require("../models");

//Authenticate User and Generate JSON Web Token for future use
module.exports = app => {
  app.post("/loginUser", (req, res, next) => {
    passport.authenticate("login", (err, users, info) => {
      //Catch / Handle Errors
      if (err) {
        console.error(`error ${err}`);
      }
      //Throw if no user is found
      if (info !== undefined) {
        console.error(info.message);
        if (info.message === "bad username") {
          res.status(401).send(info.message);
        } else {
          res.status(403).send(info.message);
        }
      } else {
        req.logIn(users, () => {
          db.User.findOne({
            where: {
              username: req.body.username
            }
          }).then(user => {
            const token = jwt.sign({ id: user.id }, jwtSecret.secret);
            res.status(200).send({
              auth: true,
              token,
              message: "user found & logged in"
            });
          });
        });
      }
    })(req, res, next);
  });
};
