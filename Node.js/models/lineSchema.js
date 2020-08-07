var mongoose = require("mongoose");

var lineSchema = new mongoose.Schema({
    name: String,
    stations: [{ x: Number, y: Number}]
});

module.exports = mongoose.model("Line", lineSchema);