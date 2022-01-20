const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    privacy: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);