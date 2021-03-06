var mongoose = require("mongoose");

var priceGroupSchema = new mongoose.Schema({
    label: {type: String},
    order: {type: Number},
    prices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Price"
        }
    ],
   addDate: {type: Date}
});

module.exports = mongoose.model("PriceGroup", priceGroupSchema);