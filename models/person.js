var mongoose = require("mongoose");

var personSchema = new mongoose.Schema({
    name: String,
    title: String,
    photo: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Photo"
      },
    blurb: String,
   addDate: {type: Date}
});

module.exports = mongoose.model("Person", personSchema);


