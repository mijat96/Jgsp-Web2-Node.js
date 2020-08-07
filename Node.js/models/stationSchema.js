var mongoose = require("mongoose");

var stationSchema = new mongoose.Schema({
    name: String,
    x: Number,
    y: Number
});

module.exports = mongoose.model("StationSchema", stationSchema);