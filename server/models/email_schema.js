const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const EmailSchema = new mongoose.Schema({
        per_day: Number,
        accounts: String
});

module.exports = {
    EmailSchema
}