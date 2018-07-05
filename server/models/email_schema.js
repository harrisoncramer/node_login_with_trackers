const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const EmailSchema = new mongoose.Schema({
        per_day: {
            type: Number,
        },
        alert_time: {
            type: String,
        }
});

module.exports = {
    EmailSchema
}