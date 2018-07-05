const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const CourtCaseSchema = new mongoose.Schema({
        case_id: Number,
        frequency: Number,
        case_name: String
});

module.exports = {
    CourtCaseSchema
}