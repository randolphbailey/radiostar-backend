const db = require("../models");

module.exports = function(app) {
  //Get video by ID
  app.get("/v/:vId", (req, res) => {
    console.log("placeholder");
  });
};
