const expect = require("expect");
const supertest = require("supertest");
const { ObjectID } = require("mongodb");
const { app } = require("../server.js");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const { users, populateUsers } = require("./seed/seed");

// Reset database for tests
beforeEach(populateUsers);

describe("GET /", () => {
    it("Should return logged in page if user is authenticated", (done) => {
        supertest(app)
            .get("/")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.text === "<p>CUSTOM USER HERE</p>");
            })
            .end(done);
    });
    it("Should redirect to login page", (done) => {
        supertest(app)
            .get("/")
            .expect(401)
            .expect((res) => {
                expect(res.text === "<p>THIS IS THE LOGIN PAGE<p>");
            })
            .end(done);
    });
});

describe("POST /users", () => {
    it("Should post a new user", (done) => {
        var email = "uniqueemail@example.com"
        var password = "9webipasd"
        supertest(app)
            .post("/users") // Post request to the /todos URL
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers).toIncludeKey('x-auth')
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });
    it("Should not post a duplicate email", (done) => {
        supertest(app)
            .post("/users")
            .send({
                email: users[0].email,
                password: "sidhf89we"
            }) // Try to post old email
            .expect(400)
            .end(done)
    });
    it("Should return validation errors", (done) => {
        var email = "notvalid";
        var password = "";
        supertest(app)
            .post("/users")
            .send({
                email: email,
                password: password
            })
            .expect(400) // Doesn't send anything back becuase our User model breaks it. Catch block of our "/users" route.
            .end(done);
    });
});

describe("POST /users/me", () => {
    it("Should return current user if authenticated", (done) => {
        supertest(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token) // Pass in token.
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it("Should return 401 error if not authenticated", (done) => {
        supertest(app)
            .get("/users/me") // No token! Our authenticate route will fail
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);

    });
});

describe("POST /users/login", () => { // This will return a token to the user.
    it("Should login a user with the valid email and password", (done) => {
        supertest(app)
            .post("/users/login")
            .send({
                email: users[1].email, // Pass in login credentials of someone w/out token
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toExist();
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: "auth",
                        token: res.headers["x-auth"]
                    });
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe("DELETE /users/me/token", () => {
    it("Should logout a user by deleting the jwt token", (done) => {
        supertest(app)
            .delete("/users/me/")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .end((err,res) => {
                if(err){
                    done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });
});
