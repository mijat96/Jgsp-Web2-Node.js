var mongoose = require("mongoose");

var ticketPriceSchema = new mongoose.Schema({
    price: String,
    ticketType: String,
    customerType: String,
    priceListId: String
});

module.exports = mongoose.model("TicketPriceSchema", ticketPriceSchema);