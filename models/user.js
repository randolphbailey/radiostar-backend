"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: { type: DataTypes.STRING, validate: { isEmail: true } },
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE
  });

  return User;
};
