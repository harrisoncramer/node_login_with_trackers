const mongoose = require("mongoose");

const TrackerSchema = new mongoose.Schema({
        case_id: Number,
        frequency: Number,
        case_name: String
});

module.exports = {
    TrackerSchema
}