const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const LegislationSchema = new mongoose.Schema({
        legislation: String
});

module.exports = {
    LegislationSchema
}