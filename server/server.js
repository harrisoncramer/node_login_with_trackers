const express = require("express");
const _ = require("lodash");
const config = require("./config/config.js");
const path = require("path");

const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { User } = require("./models/user");
const { ObjectID } = require("mongodb");
const { authenticate } = require("./middleware/authenticate");

const app = express();

app.use(bodyParser.json());

app.get("/", authenticate, (req,res) => {

})

// ROUTES

app.post("/users", (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post("/users/login", (req,res) => {
    var { email, password } = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(email,password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token)
            .status(200)
            .sendFile("index.html", {root: path.join(__dirname + '../../public')});
        })
    }).catch((e) => {
        res.status(400).send();
    })
});

app.get("/users/me", authenticate, (req,res) => {
    res.send(req.user);
});

app.delete("/users/logout", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).sendFile("login.html", {root: path.join(__dirname + '../../public')});
    },
    () => {
      res.status(400).send();
    }
  );
});

///// TRACKER ROUTES

app.get("/users/me/trackers", authenticate, (req,res) => {
   res.send(req.user.trackers);
});



        /*
        app.delete("/users/me/trackers", authenticate, (req,res) => {
            if (confirm("Are you sure you want to delete all trackers?")) {
                User.findOne({_id: req.user._id})
                    .then((user) => {
                        user.trackers.remove({});
                    })
            } else {
                res.status(200).send();
                console.log("None deleted.")
            }
            res.send(req.user);
        });
*/




app.post("/users/me/trackers/court_cases", authenticate, (req,res) => {
    let new_case = {
        case_id: req.body.case_id, // E.g. hr1488
        case_name: req.body.case_name, // Name of bill
        frequency: req.body.frequency   // Frequency of update (30x per day)
    };

    User.findOne({_id: req.user._id})
        .then((user) => {
            // Add the tracker to the trackers array.
            user.trackers.court_cases.push(new_case)
            return user.save();
        })
        .then(() => User.findOne({_id: req.user._id}))
        .then((user) => {
            res.send(user.trackers.court_cases)
        }).catch((e) => {
            res.status(400).send();
        });
});

app.post("/users/me/trackers/tweets", authenticate, (req,res) => {
    let new_account = req.body.account;

    User.findOne({_id: req.user._id})
        .then((user) => {
            // Add the tracker to the trackers array.
            user.trackers.tweets.push(new_account)
            return user.save();
        })
        .then(() => User.findOne({_id: req.user._id}))
        .then((user) => {
            res.send(user.trackers.tweets)
        }).catch((e) => {
            res.status(400).send();
        });
});


app.post("/users/me/trackers/legislation", authenticate, (req,res) => {
    let new_legislation = req.body.legislation;

    User.findOne({_id: req.user._id})
        .then((user) => {
            // Add the tracker to the trackers array.
            user.trackers.legislation.push(new_legislation)
            return user.save();
        })
        .then(() => User.findOne({_id: req.user._id}))
        .then((user) => {
            res.send(user.trackers.legislation)
        }).catch((e) => {
            res.status(400).send();
        });
});




const port = process.env.PORT;
app.listen(port, () => {
    console.log(`___${process.env.NODE_ENV || "development"} server____ started on port ${port}.\n`);
});

module.exports = { app };