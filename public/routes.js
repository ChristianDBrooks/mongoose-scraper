const cheerio = require('cheerio');
const axios = require('axios');
const article = require('../models/articleModel');

const allRoutes = function (app) {
    // HOME PAGE
    // A GET route for scraping the echoJS website
    app.get("/", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("http://www.javascriptissexy.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            $("div.list-item").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("article.postItem")
                    .children("header.postHeader")
                    .children("h3")
                    .children("a").text();
                result.url = $(this)
                    .children("article.postItem")
                    .children("header.postHeader")
                    .children("h3")
                    .children("a").attr("href");
                result.description = $(this)
                    .children("article.postItem")
                    .children("div.postInfo")
                    .children("div")
                    .children("div")
                    .children("p")
                    .text()
                    .substring(0, 150)
                    + "...";

                article.count({ title: result.title }, function (err, results) {
                    if (err) console.log("Error checking for existing error.");
                    console.log(`Articles found looks like: ${results}`);
                    if (results === 0) {
                        // Create a new Article using the `result` object built from scraping
                        console.log(`Creating new article for "${result.title}!`);
                        article.create(result)
                            .then(function (dbArticle) {
                                // View the added result in the console
                                console.log(dbArticle);
                            })
                            .catch(function (err) {
                                // If an error occurred, send it to the client
                                return res.json(err);
                            });
                    } else {
                        console.log(`Article "${result.title}" already exists!`);
                    }
                })

            });

            // If we were able to successfully scrape and save an Article, send a message to the client
            res.render('index', { message: "Scrape Complete" });
        });
    });

    app.get('/article', function (req, res) {
        article.find({}, function (err, article) {
            if (err) console.log("Error trying to find articles in database.");
            res.render("article", { data: article });
        })
    })

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/article/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/article/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        comment.create(req.body)
            .then(function (dbComment) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
};

module.exports = allRoutes;