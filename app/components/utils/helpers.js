var axios = require("axios");

var helper = {

  getArticles: function() {
    return axios.get("/")
    .then(function(response) {
      return response;
    })
  },

  saveArticle: function(newArticle) {
    console.log("helpers.saveArticle - newArticle ", newArticle);
    return axios.post("/save/:id", {article:newArticle})
    .then(function(response){
      console.log("helpers.postArticle response id ", response._id);
      return response._id;
    })
  },

  saveNote: function(newNote) {
    return axios.post("/:id", { note:newNote });
  },

  getNotes: function() {
    return axios.get("/:id")
    .then(function(response){
      console.log("helpers.getNotes response from '/:id' get request ", response);
      return response;
    })
  },

  deleteNote: function(id) {
    return axios.post("/delete/"+id);
  }

};

module.exports = helper;
