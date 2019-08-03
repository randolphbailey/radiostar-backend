const db = require("../models");

module.exports = function(app) {
  app.get(
    "/videolist",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      db.Video.findAll({
        limit: 10,
        attributes: ["title", "vId", "description", "videoURL"],
        where: { UserId: req.user.id }
      })
        .then(videos => res.json(videos))
        .catch(err => console.log("Error fetching videos:", err));
    }
  );
};
