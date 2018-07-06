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


const EmailSchema = new mongoose.Schema({
        per_day: {
            type: Number,
        },
        alert_time: {
            type: String,
        }
});

const TwitterSchema = new mongoose.Schema({
        account: String
});


const LegislationSchema = new mongoose.Schema({
        legislation: String
});

module.exports = {
    CourtCaseSchema,
    EmailSchema,
    TwitterSchema,
    LegislationSchema
}