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

const TwitterSchema = new mongoose.Schema({
        account: {
            type: String,
            required: true
        }
});

const LegislationSchema = new mongoose.Schema({
        legislation: {
            type: String,
            required: true
        }
});

module.exports = {
    CourtCaseSchema,
    TwitterSchema,
    LegislationSchema,
}