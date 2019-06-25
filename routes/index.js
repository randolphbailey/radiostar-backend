var express = require("express");
var router = express.Router();
const db = require("../models");
const shortid = require("shortid");

//Configure Backblaze B2 Integration
const B2 = require("backblaze-b2");
const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY
});
b2.authorize();

//Sequelize init
db.sequelize.sync({ force: false });

//Request URL to upload files to from Backblaze and update database with info
router.get("/upload/getURL", (req, res) => {
  //Request upload URL
  b2.getUploadUrl({ bucketId: "c683ce23e3bb71a16bbc0f14" }).then(b2Response => {
    //Generate unique video ID
    b2Response.data.vId = shortid.generate();

    //Send information needed for upload to front-end
    res.send(b2Response.data);

    //Create new video in database
    db.Video.create({
      vId: b2Response.data.vId,
      b2BucketId: b2Response.data.bucketId,
      b2AuthorizationToken: b2Response.data.authorizationToken,
      b2UploadURL: b2Response.data.uploadUrl
    }).then(res => console.log(res));
  });
});

//Update DB with file upload info sent from front-end
router.post("/upload/fileInfo", (req, res) => {
  db.Video.update(
    {
      b2AccountId: req.body.accountId,
      b2Action: req.body.action,
      b2BucketId: req.body.bucketId,
      b2ContentLength: req.body.contentLength,
      b2ContentSHA1: req.body.contentSha1,
      b2ContentType: req.body.contentType,
      b2FileId: req.body.fileId,
      b2FileInfo: JSON.stringify(req.body.fileInfo),
      b2UploadTimestamp: req.body.uploadTimestamp
    },
    { where: { vId: req.body.fileInfo.vid } }
  ).then(rowsUpdated => res.json(rowsUpdated));
});

module.exports = router;
