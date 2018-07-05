var { User } = require("../models/user");
const path = require("path");
const axios = require("axios");

tweetValidator = function(req, res, next){
   var new_handle = req.body.account;
   var url = `https://twitter.com/users/username_available?username=${new_handle}`
   axios.get(url)
        .then((response) => {
            if(!response.data.valid){ // If it's not taken...
                return Promise.reject(`Sorry, ${req.body.account} could not be tracked.`);
            }
            next();
        })
        .catch((error) => {
            res.status(400).send(error);
        });
};

module.exports = {
    tweetValidator
}