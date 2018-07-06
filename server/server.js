const express = require("express");
const _ = require("lodash");
const config = require("./config/config.js");
const path = require("path");

const {ObjectId} = require('mongodb'); // or ObjectID

const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");
const { tweetValidator, legislationValidator, caseValidator } = require("./middleware/trackerValidators");

const app = express();

app.use(bodyParser.json());

    app.get("/", authenticate, (req,res) => {
        User.findOne({_id: req.user._id}).then((user) => {
            res.status(200).sendFile("index.html", {root: path.join(__dirname + '../../public')});
        })
        .catch((e) => {
            res.status(400).send(e);
        })
    });

// ROUTES

    app.post("/users", (req,res) => {
        var body = _.pick(req.body, ['email', 'password']);
        body.frequency = {
            alert_time: new Date(),
            email: req.body.email
        }
        var user = new User(body);

        user.save().then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            res.header("x-auth", token);
            res.send(user);
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

    app.get("/users/me/", authenticate, (req,res) => {
        User.findOne({_id: req.user._id}).then((user) => {
            res.status(200).send(user)
        })
        .catch((e) => {
            res.status(400).send();
        })
    });

    app.delete("/users/me", authenticate, (req, res) => {
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
        User.findOne({_id: req.user._id}).then((user) => {
            res.status(200).send(user.trackers)
        })
        .catch((e) => {
            res.status(400).send();
        })
    });

    app.post("/users/me/trackers/court_cases", authenticate, caseValidator, (req,res) => {
        let new_case = {
            case_id: req.body.case_id, // E.g. hr1488
            case_name: req.body.case_name, // Name of bill
            frequency: req.body.frequency   // Frequency of update (30x per day)
        };

        User.findOne({_id: req.user._id})
            .then((user) => {
                user.trackers.court_cases.push(req.body);
                return user.save();
            })
            .then((user) => {
                res.status(200).send(user.trackers.court_cases);
            }).catch((e) => {
                res.status(400).send(e);
            });
    });


    app.delete("/users/me/trackers/court_cases/:case_id", authenticate, (req,res) => {
            const case_id = req.params.case_id;
            User.findOne({_id: req.user._id})
                .then((user) => {
                    user.trackers.court_cases.id(case_id).remove();
                    return user.save();
                })
                .then((user) => {
                    console.log("SUCCESS");
                    res.status(200).send(user.trackers.court_cases);
                })
                .catch((e) => res.status(400).send(e));

    });

    app.post("/users/me/trackers/tweets", authenticate, tweetValidator, (req,res) => {
        User.findOne({_id: req.user._id})
            .then((user) => {
                user.trackers.tweets.push(req.body);
                return user.save();
            })
            .then((user) => {
                res.status(200)
                    .send(user.trackers.tweets)
            })
            .catch((e) => {
                res.status(400).send(e);
            });
    });

    app.delete("/users/me/trackers/tweets/:tweet_id", authenticate, (req,res) => {
            const tweet_id = req.params.tweet_id;
            User.findOne({_id: req.user._id})
                .then((user) => {
                    user.trackers.tweets.id(tweet_id).remove();
                    return user.save();
                })
                .then((user) => {
                    res.status(200).send(user.trackers.tweets);
                })
                .catch((e) => res.status(400).send(e));

    });

    app.post("/users/me/trackers/legislation", authenticate, legislationValidator, (req,res) => {
        let new_legislation = {
            legislation: req.body.legislation
        }
        User.findOne({_id: req.user._id})
            .then((user) => {
                user.trackers.legislation.push(req.body);
                return user.save();
            })
            .then((user) => {
                res.status(200).send(user.trackers.legislation);
            }).catch((e) => {
                res.status(400).send(e);
            });
    });


    app.delete("/users/me/trackers/legislation/:legislation_id", authenticate, (req,res) => {
            const legislation_id = req.params.legislation_id;
            User.findOne({_id: req.user._id})
                .then((user) => {
                    user.trackers.legislation.id(legislation_id).remove();
                    return user.save();
                })
                .then((user) => {
                    res.status(200).send(user.trackers.legislation);
                })
                .catch((e) => res.status(400).send(e));

    });


    app.delete("/users/me/trackers", authenticate, (req,res) => {
        User.findOne({_id: req.user._id})
            .then((user) => {
                    user.trackers.legislation = [];
                    user.trackers.tweets = [];
                    user.trackers.court_cases = [];
                return user.save();
            })
            .then(() => User.findOne({_id: req.user._id}))
            .then((user) => {
                res.status(200).send(user.trackers)
            }).catch((e) => {
                res.status(400).send();
            });
    });

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`___${process.env.NODE_ENV || "development"} server____ started on port ${port}.\n`);
});

module.exports = { app };