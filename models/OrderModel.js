const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = Schema({
    userID: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    restaurantName: {
        type: String,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    order: {
        type: Object,
        required: true,
    }
});

module.exports = mongoose.model("Order", orderSchema);