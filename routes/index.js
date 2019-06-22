var express = require("express");
var router = express.Router();
const upload = require("../bin/upload");

router.post("/upload", upload);

module.exports = router;
