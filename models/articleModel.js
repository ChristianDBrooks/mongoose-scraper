const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defines a new schema or format for what kinda of columns are in a row.
const articleSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: "Title is required."
    },
    description: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        trim: true,
        required: "URL is required."
    },
})

// Create new model using the format of the Schema. Model is like a row.
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;

