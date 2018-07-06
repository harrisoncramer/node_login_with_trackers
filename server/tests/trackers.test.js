const expect = require("expect");
const supertest = require("supertest");
const { ObjectID } = require("mongodb");
const { app } = require("../server.js");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const { users, populateUsers } = require("./seed/seed");

// Reset database for tests
beforeEach(populateUsers);

describe("POST /users/me/trackers/tweets", () => {
    it("Should post a new twitter handle", (done) => {
        const account = "harrisoncramer";
        supertest(app)
            .post("/users/me/trackers/tweets")
            .set("x-auth", users[0].tokens[0].token) // Pass in token.
            .send({account: account})
            .expect(200)
            .expect((res) => {
               expect(res.body[0].account === account);
            })
            .end(done)
    });

    it("Should not post an invalid twitter handle", (done) => {
        const account = "sdsiopdfanusdfoiosd";
        supertest(app)
            .post("/users/me/trackers/tweets")
            .set("x-auth", users[0].tokens[0].token) // Pass in token.
            .send({account: account})
            .expect(400)
            .end((err,res) => {
                if(err){
                    done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.trackers.tweets.length === 0)
                    done();
                })
            })
    });
});


describe("POST /users/me/trackers/legislation", () => {
    it("Should post a new legislation", (done) => {
        const legislation = "hr1260";
        supertest(app)
            .post("/users/me/trackers/legislation")
            .set("x-auth", users[0].tokens[0].token) // Pass in token.
            .send({legislation: legislation})
            .expect(200)
            .expect((res) => {
               expect(res.body[0].legislation === legislation);
            })
            .end((err,res) => {
                if(err){
                    done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.trackers.legislation.length === 1)
                    expect(user.trackers.legislation === legislation)
                        done();
                })
            })
    });
    it("Should not post invalid legislation", (done) => {
        const legislation = {};
        supertest(app)
            .post("/users/me/trackers/legislation")
            .set("x-auth", users[0].tokens[0].token) // Pass in token.
            .send({legislation: legislation})
            .expect(400)
            .end((err,res) => {
                if(err){
                    done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.trackers.legislation.length === 0)
                    done();
                });
            })
    });
});


describe("POST /users/me/trackers/court_cases", () => {
    it("Should post a new court case", (done) => {

        const new_courtcase = {
            "case_id": 333166,
            "frequency": 30,
            "case_name": "Case name"
        }

        supertest(app)
            .post("/users/me/trackers/court_cases")
            .set("x-auth", users[0].tokens[0].token) // Pass in token.
            .send(new_courtcase)
            .expect(200)
            .expect((res) => {
               expect(res.body[0].legislation === new_courtcase);
            })
            .end((err,res) => {
                if(err){
                    done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.trackers.court_cases.length === 1);
                    expect(user.trackers.court_cases === new_courtcase)

                    done();
                })
            })
    });

    it("Should not post an invalid new court case", (done) => {

        const new_courtcase = {
            "frequency": "ssfop"
        }

        supertest(app)
            .post("/users/me/trackers/court_cases")
            .set("x-auth", users[0].tokens[0].token) // Pass in token.
            .send(new_courtcase)
            .expect(400)
            .end((err,res) => {
                if(err){
                    done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.trackers.court_cases.length === 0);
                    done();
                })
            })
    });
});