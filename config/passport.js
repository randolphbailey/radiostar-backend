const jwtSecret = require("./jwtConfig");
const bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 12;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false
    },
    (username, password, done) => {
      try {
        db.User.findOne({ where: { username: username } }).then(user => {
          if (user !== null) {
            console.log("username already taken");
            return done(null, false, { message: "username already taken" });
          } else {
            bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
              db.User.create({ username, password: hashedPassword }).then(
                user => {
                  console.log("user created");
                  return done(null, user);
                }
              );
            });
          }
        });
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false
    },
    (username, password, done) => {
      try {
        db.User.findOne({ where: { username: username } }).then(user => {
          if (user === null) {
            return done(null, false, { message: "bad username" });
          } else {
            bcrypt.compare(password, user.password).then(response => {
              if (response !== true) {
                console.log("passwords do not match");
                return done(null, false, { message: "passwords do not match" });
              }
              console.log("user found and authenticated");
              return done(null, user);
            });
          }
        });
      } catch (err) {
        done(err);
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: jwtSecret.secret
};

passport.use(
  "jwt",
  new JWTstrategy(opts, (jwt_payload, done) => {
    try {
      db.User.findOne({ where: { id: jwt_payload.id } }).then(user => {
        if (user) {
          console.log("user found in db in passport");
          done(null, user);
        } else {
          console.log("user not found in db");
          done(null, false);
        }
      });
    } catch (err) {
      done(err);
    }
  })
);
