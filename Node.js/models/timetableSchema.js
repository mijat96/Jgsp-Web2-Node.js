var mongoose = require("mongoose");

var timetableSchema = new mongoose.Schema({
    day: String,
    departures: String,
    lineId: String
});

module.exports = mongoose.model("TimetableSchema", timetableSchema);