# boilerplate_jwt_node_api
Boilerplate Node API w/ JWT Login

Run NPM install to install relevant modules. Requires a config.json file to run, stored in the config folder.

Could look something like this:

    {
        "test" : {
            "PORT" : 3000,
            "MONGODB_URI" : "mongodb://localhost:27017/YourTestDatabase",
            "JWT_SECRET" : "yoursaltingthinghere"
        },
        "development" : {
            "PORT" : 3000,
            "MONGODB_URI" : "mongodb://localhost:27017/YourDevDatabase",
            "JWT_SECRET" : "yoursaltingthinghere"
        }
    }
