var express = require("express");
var bodyParser = require("body-parser");
// var router = require('./controllers/controller.js');
var methodOverride = require('method-override');
var path = require('path');
var exphbs = require('express-handlebars');
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var request = require("request");
var cheerio = require("cheerio");
var Promise = require("bluebird");
var vc = "Vigilant Citizen";
var ats = "Above Top Secret";
var cm = "Cryptomundo";
var pn = "Paranormal News";
var di = "David Icke";
var currentArticle = "default";
// var up = "The Unbelievable Podcast";

mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Setting up morgan, body-parser, and a static folder
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//Setting up handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

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


/////  Routes  \\\\\
/////  ======  \\\\\
/*/////
  The scrape will run on server start and hitting "/",
  pushing all new articles to the db with a "source" field
  associated to where each article was sourced.
/////*/
scrape();

// Testing basic format with vc MVC
app.get("/", function(req, res){
  scrape();
  Article.find().sort({"scrapeDate":-1}).exec( function(err, found){
    if(err) {
    } else {
      res.render("index",{found : found});
    }
  });

});
app.get("/saved", function(req, res){
  scrape();
  Article.find().sort({"saved": true}).exec( function(err, found){
    if(err) {
    } else {
      res.render("index",{found : found});
    }
  });

});

/////////////// SMALL TEST  \\\\\\\\\\\\\
////  Just with vigilantcitizen data  \\\\
// This will grab an article by it's ObjectId
app.get("/:id", function(req, res) {

  Article.findOne({"_id": req.params.id}).populate("notes").exec(function(err, article){
      if(err) {
        res.send(err);
      } else {
        res.send(article.notes);
      };
  });

});
// Create a new note or replace an existing note
app.post("/:id", function(req, res) {
  if (res.status != 200) {
    console.log(res);
  }
  var newNote = new Note(req.body);
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
            res.redirect(req.originalUrl);
        }
        });
      };
    });
});

app.post("/save/:id", function(req, res) {
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

app.post("/delete/:id", function(req, res) {
  Note.findByIdAndRemove(req.params.id, function(err, data){
    if(err) {
      console.log("delete err: ", err);
    } else {
      // res.redirect();
    }
  });
});
/* A GET request to scrape the 5 websites: Vigilant Citizen, Above Top Secret, Cryptomundo, Paranormal News, and David Icke */
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

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("App running on port "+ port);
});
