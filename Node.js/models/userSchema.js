var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    username: String,
    password: String,
    confirmPassword: String,
    email: String,
    date: String,
    tip: String,
    role: String,
    approved: Boolean
});

module.exports = mongoose.model("User", userSchema);