var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create schema for Note
var NoteSchema = new Schema({
  // should I name this 'text' or something other than 'body'?
  body: {
    type: String,
    trim: true,
    validate: [
      function(input) {
        return input.length >= 1 && input.length <= 301;
      },
      "If you would like to leave a comment on this article, please make sure that its length is between 1 and 300 characters long."
    ]
  },
  // articleId: {
  //   type: String,
  //   require: true
  // },
  noteCreated: {
    type: Date,
    default: Date.now
  }
});

//Custom method for associating this note with the specific article
// NoteSchema.methods.getArticleId = function(id) {
//   this.articleId = id;
// }

// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
