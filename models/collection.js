var mongoose = require("mongoose");

var collectionSchema = new mongoose.Schema({
    title: {type: String},
    titleLower: {type: String},
    images: [
        {
            path: String,
            title: String,
            alt: String,
            showOnHome: Boolean
        }
    ]
});

module.exports = mongoose.model("Collection", collectionSchema);


