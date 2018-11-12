// DEPENDENCIES
const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');


// HOOKS

// Use express features with app...
const app = express();

// Set port to 3000 by default.
PORT = 3000;

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes file
const routes = require('./public/routes');

// Database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));  

// Handlebars Set Up
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
 
// ROUTES 
// The imported routes function to listen on port for those routes.
routes(app);

// Start app listening on port. 
app.listen(PORT, function() {
    console.log("App listening on port: ", PORT);
});