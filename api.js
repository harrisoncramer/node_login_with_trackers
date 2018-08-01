const express = require("express");
const config = require("./config/config.js");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");

const app = express();
app.use(bodyParser.json());

routes(app); // Pass in app to routes function.

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`___Backend ${process.env.NODE_ENV || "development"} server____ started on port ${port}.\n`);
});

module.exports = { app }; // For testing purposes (our final app)