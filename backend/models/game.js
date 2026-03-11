const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
    playerX: String,
    playerO: String,
    winner: String,
    duration: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Game", GameSchema);