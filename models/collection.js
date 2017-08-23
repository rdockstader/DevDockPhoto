var mongoose = require("mongoose");

var collectionSchema = new mongoose.Schema({
    title: {type: String},
    titleLower: {type: String},
    images: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Photo"
      }
   ]
});

module.exports = mongoose.model("Collection", collectionSchema);


