var express = require("express");
var app = express();

var db = require("./db");

var UserController = require("./user/UserController");
var authController = require("./auth/AuthController");

app.use("/api/auth", authController);
app.use("/users", UserController);

module.exports = app;
