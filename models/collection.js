var mongoose = require("mongoose");

var collectionSchema = new mongoose.Schema({
    title: {type: String},
    titleLower: {type: String},
    order: Number,
    images: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Photo"
      }
   ],
   addDate: {type: Date}
});

module.exports = mongoose.model("Collection", collectionSchema);


