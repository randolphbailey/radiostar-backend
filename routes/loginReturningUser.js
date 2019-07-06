var passport = require("passport");

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
