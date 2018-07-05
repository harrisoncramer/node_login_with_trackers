const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const TwitterSchema = new mongoose.Schema({
        account: String
});

module.exports = {
    TwitterSchema
}