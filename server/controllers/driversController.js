const { mongoose } = require("../db/mongoose");
const { User } = require("../models/user");
const path = require("path");
const _ = require("lodash");

const home = (req,res) => {
  User.findOne({_id: req.user._id})
  .then((user) => {
      res.status(200).send("You're logged in!")
  })
  .catch((e) => {
      res.status(400).send(e);
  })};
const users = (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token);
        res.send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });};
const login = (req,res) => {
    var { email, password } = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(email,password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token)
            .status(200)
            .sendFile("index.html", {root: path.join(__dirname + '../../../public')});
        })
    }).catch((e) => {
        res.status(400).send();
    })};
const showme = (req,res) => {
    User.findOne({_id: req.user._id}).then((user) => {
        res.status(200).send(user)
    })
    .catch((e) => {
        res.status(400).send();
    })};
const logout = (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200)
      .sendFile("login.html", {root: path.join(__dirname + '../../../public')});
    })
    .catch((e) => {
        res.status(400).send();
    })};
const trackers = (req,res) => {
    User.findOne({_id: req.user._id}).then((user) => {
        res.status(200).send(user.trackers)
    })
    .catch((e) => {
        res.status(400).send();
    })};
const court_cases = (req,res) => {
  User.findOne({_id: req.user._id})
    .then((user) => {
      user.trackers.court_cases.push(req.body)
      return user.save();
    })
    .then((user) => {
      res.status(200)
          .send(user.trackers.court_cases);
    })
    .catch((e) => {
          res.status(400).send(e);
    })};
const delete_case = (req,res) => {
  const case_id = req.params.case_id;
  User.findOne({_id: req.user._id})
      .then((user) => {
          user.trackers.court_cases.id(case_id).remove();
          return user.save();
      })
      .then((user) => {
          res.status(200).send(user.trackers.court_cases);
      })
      .catch((e) => res.status(400).send(e));}
const tweets = (req,res) => {
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
        });}
const delete_tweet = (req,res) => {
  const tweet_id = req.params.tweet_id;
  User.findOne({_id: req.user._id})
      .then((user) => {
          user.trackers.tweets.id(tweet_id).remove();
          return user.save();
      })
      .then((user) => {
          res.status(200).send(user.trackers.tweets);
      })
      .catch((e) => res.status(400).send(e));};
const legislation = (req,res) => {
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
      });};
const delete_legislation = (req,res) => {
  const legislation_id = req.params.legislation_id;
  User.findOne({_id: req.user._id})
      .then((user) => {
          user.trackers.legislation.id(legislation_id).remove();
          return user.save();
      })
      .then((user) => {
          res.status(200).send(user.trackers.legislation);
      })
      .catch((e) => res.status(400).send(e));};
const delete_trackers = (req,res) => {
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
      });};

module.exports = {
  home,
  users,
  login,
  showme,
  logout,
  trackers,
  court_cases,
  delete_case,
  tweets,
  delete_tweet,
  legislation,
  delete_legislation,
  delete_trackers
};