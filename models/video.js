"use strict";
module.exports = (sequelize, DataTypes) => {
  var Video = sequelize.define("Video", {
    title: DataTypes.STRING,
    videoURL: { type: DataTypes.STRING, unique: true },
    vId: { type: DataTypes.STRING, unique: true },
    description: DataTypes.TEXT,
    b2AccountId: DataTypes.STRING,
    b2Action: DataTypes.STRING,
    b2BucketId: DataTypes.STRING,
    b2ContentLength: DataTypes.INTEGER,
    b2ContentSHA1: DataTypes.STRING,
    b2ContentType: DataTypes.STRING,
    b2FileId: DataTypes.STRING,
    b2FileInfo: DataTypes.JSON,
    b2FileName: DataTypes.STRING,
    b2AuthorizationToken: DataTypes.STRING,
    b2UploadTimestamp: DataTypes.INTEGER,
    b2UploadURL: { type: DataTypes.STRING, validate: { isUrl: true } }
  });

  Video.associate = function(models) {
    models.Video.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Video;
};
