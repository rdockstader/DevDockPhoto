var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
    path: String,
    title: String,
    alt: String,
    key: String,
    showOnHome: Boolean
});

module.exports = mongoose.model("Photo", photoSchema);


