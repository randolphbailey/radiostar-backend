"use strict";
module.exports = (sequelize, DataTypes) => {
  var Video = sequelize.define("Video", {
    title: DataTypes.STRING
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
