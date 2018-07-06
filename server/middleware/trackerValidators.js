var { User } = require("../models/user");
const path = require("path");
const axios = require("axios");

tweetValidator = function(req, res, next){
   var new_handle = req.body.account;
    var re = /^@?(\w){1,15}$/;
    if(re.test(new_handle)){
        var url = `https://twitter.com/${new_handle}`;
        axios.get(url)
            .then((response) => {
                next();
            })
            .catch((error) => {
                if(error.response.status === 404){
                     res.status(400)
                        .send("That handle could not be found.")
                } else {
                    res.status(400)
                        .send("Something is wrong.")
                }
            });
    } else {
        res.status(400).send("That is not a valid twitter handle.")
    }
};

legislationValidator = function(req, res, next){
   next();
};

caseValidator = function(req, res, next){
   next();
};

module.exports = {
    tweetValidator,
    legislationValidator,
    caseValidator
}