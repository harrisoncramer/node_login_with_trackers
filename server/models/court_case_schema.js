const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const CourtCaseSchema = new mongoose.Schema({
        case_id: {
            type: Number,
            required: true
        },
        frequency: Number,
        case_name: String
});

module.exports = {
    CourtCaseSchema
}