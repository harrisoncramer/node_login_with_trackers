const mongoose = require("mongoose");

mongoose.Promise = global.Promise; // Tell mongoose to use promises.
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
}