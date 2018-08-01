// CONFIGURE DATABASES
var env = process.env.NODE_ENV || 'development'; // Only set on Heroku. Configure on package.json file for test/development environments. Allows us to use different databases.

if(env === "development" || env === "test") {
   var config = require("./config.json")
   var envConfig = config[env]; // Passing in the env string...
   Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key]
   })
}