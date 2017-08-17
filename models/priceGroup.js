var mongoose = require("mongoose");

var priceGroupSchema = new mongoose.Schema({
    label: {type: String},
    order: {type: Number},
    prices: [
        {
            priceType: String,
            time: String,
            price: String
        }
    ]
});

module.exports = mongoose.model("PriceGroup", priceGroupSchema);


