var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Creating schema
var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  source: {
    type: String,
    required: true
  },
  scrapeDate: {
    type: Date,
    default: Date.now
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
