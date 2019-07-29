const db = require("../models");

module.exports = function(app) {
  app.get("/videolist", (req, res) => {
    db.Video.findAll({
      limit: 10,
      attributes: ["title", "vId", "description", "videoURL"]
    })
      .then(videos => res.json(videos))
      .catch(err => console.log("Error fetching videos:", err));
  });
};
