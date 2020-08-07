var mongoose = require("mongoose");

var stationLineSchema = new mongoose.Schema({
    lineId: String,
    stationID: String
});

module.exports = mongoose.model("StationLineSchema", stationLineSchema);