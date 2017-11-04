var mongoose = require("mongoose");

var priceSchema = new mongoose.Schema({
    priceType: String,
    time: String,
    price: String,
    addDate: {type: Date}
});

module.exports = mongoose.model("Price", priceSchema);


