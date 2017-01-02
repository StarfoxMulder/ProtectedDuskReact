var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require('method-override');
var path = require('path');
var logger = require("morgan");
var mongoose = require("mongoose");
var Router = express.Router();
var routes = require("./routes/index.js")
var request = require("request");
var Promise = require("bluebird");


mongoose.Promise = Promise;

// Initialize Express
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static("./public"));
app.use(routes);

// Configuring protected_dust database
var databaseUri = "mongodb://localhost/protected_dust";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("App running on port "+ port);
});
