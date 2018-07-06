var { User } = require("../models/user");
const path = require("path");
const axios = require("axios");

tweetValidator = function(req, res, next){
   var new_handle = req.body.account;
   var url = `https://twitter.com/${new_handle}`;

    axios.get(url)
        .then((response) => {
            next();
        })
        .catch((error) => {
            if(error.response.status === 404){
                 res.status(400)
                    .send("That tweet could not be found.")
            } else {
                res.status(400)
                    .send("Something is wrong.")
            }
        });
};

module.exports = {
    tweetValidator
}