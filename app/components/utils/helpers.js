var axios = require("axios");

var helper = {

  getArticles: function() {
    return axios.get("/api");
    alert("Works")
  },

  singleArticle: function() {

  },

  postNote: function(title,date,url) {
    return axios.post("/api/save", { title: title, date: date, url:url });
  },

  getNotes: function() {

  }
};

module.exports = helper;
