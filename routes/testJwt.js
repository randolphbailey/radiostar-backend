var passport = require("passport");

module.exports = function(app) {
  app.post(
    "/testJwt",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      res.send("Authorized");
    }
  );
};
