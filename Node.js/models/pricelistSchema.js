var mongoose = require("mongoose");

var pricelistSchema = new mongoose.Schema({
    validFrom: String,
    validUntil: String,
    topical: String
});

module.exports = mongoose.model("PricelistSchema", pricelistSchema);