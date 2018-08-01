const expect = require("expect");
const supertest = require("supertest");
const { ObjectID } = require("mongodb");
const { app } = require("../server.js");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const { users, populateUsers } = require("./seed/seed");

// Reset database for tests
beforeEach(populateUsers);

describe("/users/me/trackers/tweets", () => {

    const fakeId = new ObjectID()
    before((done) => {
        User.findById(users[0]._id)
            .then((user) => {
            user.trackers.tweets.push({account: "Sisd9fjans", _id: fakeId});
            return user.save()
            })
            .then(() => {
                done();
            });
    });

    it("Should POST a new twitter handle", (done) => {
        const account = "harrisoncramer";
        supertest(app)
            .post("/users/me/trackers/tweets")
            .set("x-auth", users[0].tokens[0].token) // Pass in token.
            .send({account: account})
            .expect(200)
            .end((err,res) => {
               if(err){
                    done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.trackers.tweets.length === 1);
                    expect(user.trackers.tweets === account);
                    done();
                })
            })
    });
    it("Should not POST an invalid twitter handle", (done) => {
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
    it("Should DELETE a twitter account", (done) => {
        supertest(app)
            .delete(`/users/me/trackers/tweets/${fakeId}`)
            .set("x-auth", users[0].tokens[0].token) // Pass in token.
            .expect(200)
            .end((err,res) => {
                User.findById(users[0]._id).then((user) => {
                    expect(user.trackers.tweets.length === 0);
                    done();
                });
            });
    });
});

describe("/users/me/trackers/legislation", () => {
    const fakeId = new ObjectID()
    before((done) => {
        User.findById(users[0]._id)
            .then((user) => {
            user.trackers.legislation.push({legislation: "h2", _id: fakeId});
            return user.save()
            })
            .then(() => {
                done();
            })

    })
    it("Should POST a new legislation", (done) => {
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
    it("Should not POST invalid legislation", (done) => {
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
    it("Should DELETE legislation", (done) => {
        supertest(app)
            .delete(`/users/me/trackers/legislation/${fakeId}`)
            .set("x-auth", users[0].tokens[0].token) // Pass in token.
            .expect(200)
            .end((err,res) => {
                User.findById(users[0]._id).then((user) => {
                    expect(user.trackers.legislation.length === 0);
                    done();
                });
            });
    });
});


describe("/users/me/trackers/court_cases", () => {
    it("Should POST a new court case", (done) => {
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
                });
            });
    });
    it("Should not POST an invalid new court case", (done) => {
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
                });
            });
    });
});