var express = require("express");
var mongoose = require("mongoose");
var Note = require("../models/Note");
var Article = require("../models/Article");
var request = require("request");
var Router = express.Router();
var cheerio = require("cheerio");
var vc = "Vigilant Citizen";
var ats = "Above Top Secret";
var cm = "Cryptomundo";
var pn = "Paranormal News";
var di = "David Icke";
// var up = "The Unbelievable Podcast";
var currentArticle = "default";

Router.get("/", function(req, res){
  Article.find().sort({"scrapeDate":-1}).exec( function(err, found){
    if(err) {
    } else {
      res.send(found);
    }
  });
});

Router.get("/saved", function(req, res){
  Article.find().sort({"saved": true}).exec( function(err, found){
    if(err) {
    } else {
      res.render("index",{found : found});
    }
  });
});

// Grab an article by it's ObjectId
Router.get("/:id", function(req, res) {
  Article.findOne({"_id": req.params.id}).populate("notes").exec(function(err, article){
      if(err) {
        res.send(err);
      } else {
        res.send(article.notes);
      };
  });
});

// Create a new note or replace an existing note
Router.post("/:id", function(req, res) {
  console.log("req.body == ", req.body);
  if (res.status != 200) {
    console.log(res);
  }
  var newNote = new Note(req.body.note);
  // save the new note that gets posted to the Notes collection
  newNote.save(function(err, note){
    if(err) {
      console.log(err);
    } else {
      Article.findOneAndUpdate({"_id" : req.params.id}, {$push: {notes:note}}, {safe: true, upsert: true})
      .exec(function(err, article){
          if(err) {
            console.log(err);
          } else {
            res.send(note);
        }
        });
      };
    });
});

// Update the article to set it's saved attribute to True
Router.post("/save/:id", function(req, res) {
  if (res.status != 200){
    console.log(res)
  } else {
    Article.findOneAndUpdate({"_id": req.params.id}, {saved: true})
    .exec(function(err, save) {
      if (err) {
        console.log(err);
      } else {
        res.redirect(req.originalUrl);
      }
    });
  }
});

// Delete a note assocaited with a specific article
Router.post("/delete/:id", function(req, res) {
  Note.findByIdAndRemove(req.params.id, function(err, data){
    if(err) {
      console.log("delete err: ", err);
    } else {
      // res.redirect();
    }
  });
});

Router.get("/scrape", function(req, res) {
  scrape();
  res.redirect("/");
});

module.exports = Router;

// Scrape selected websites for articles and add them to MongoDB
function scrape() {

  //Scraping Vigilant Citizen
  request("http://www.vigilantcitizen.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("div.td-module-thumb").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").attr("title");
      result.link = $(this).children("a").attr("href");
      result.image = $(this).children("a").children("img").attr("src");
      result.source = vc;
      result.scrapeDate = Date.now();

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          // console.log("turn on vc err");
        }
        else {
          // console.log("vc worked");
        }
      });
    });

  });

  //Scraping Above Top Secret
  request("http://www.abovetopsecret.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("div.headline").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = "http://www.abovetopsecret.com/touch-icon-ipad-retina.png";
      result.source = ats;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          // console.log("turn on ats err");
        }
        else {
          // console.log("ats worked");
        }
      });
    });

  });

  //Scraping Cryptomundo
  //// If a url does not have www. sould this be included? check docs
  request("http://cryptomundo.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("p.highlight").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = "https://pbs.twimg.com/profile_images/1537474618/CM_logoSq.jpg";
      result.source = cm;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          // console.log("turn on cm err");
        }
        else {
          // console.log("cm worked");
        }
      });
    });

  });

  //Scraping Paranormal News
  request("https://www.paranormalnews.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("div.listItemTitle").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = $(this).children("a").children("img").attr("src");
      result.source = pn;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          // console.log("turn on pn err");
        }
        else {
          // console.log("pn worked");
        }
      });
    });

  });

  //Scraping David Icke
  request("https://www.davidicke.com/headlines", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("h2.post-title").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = "http://cdn.images.express.co.uk/img/dynamic/1/285x214/211408_1.jpg";
      result.source = di;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          // console.log("turn on di err");
        }
        else {
          // console.log("di worked");
        }
      });
    });

  });

  // Attempting to do the same with Unbelievable Podcast archives
  // request("https://www.spreaker.com/show/the-unbelievable-podcast", function(error, response, html) {

  //   var $ = cheerio.load(html);
  //   // The content we need is located within div.td-module-thumb
  //   $("div.epl_ep_title").each(function(i, element) {

  //     var result = {};

  //     result.title = $(this).children("a").attr("title");
  //     result.link = $(this).children("a").attr("href");
  //     result.source = up;

  //     var entry = new Article(result);

  //     // Saving this instance of the Article model with
  //     //  scraped article title and url to the db
  //     entry.save(function(err, doc) {

  //       if (err) {
  //         console.log(err);
  //       }
  //       else {
  //         console.log(doc);
  //       }
  //     });
  //   });

  // });
  // Tell the browser that we finished scraping the text
  console.log("Scrape Complete");
};
