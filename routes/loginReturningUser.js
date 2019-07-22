var passport = require("passport");

//Logs in user who already has a valid JSON Web Token in Local Storage
module.exports = function(app) {
  app.get(
    "/returningUser",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      let authPackage = {
        username: req.user.username,
        isAuthenticated: true
      };
      res.json(authPackage);
    }
  );
};
