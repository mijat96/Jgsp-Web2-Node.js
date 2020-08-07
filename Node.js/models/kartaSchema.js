var mongoose = require("mongoose");

var kartaSchema = new mongoose.Schema({
    checked: Boolean,
    validUntil: Date,
    type: String,
    userId: String,
    ticketPriceId: String,
    transaction: String
});

module.exports = mongoose.model("kartaSchema", kartaSchema);