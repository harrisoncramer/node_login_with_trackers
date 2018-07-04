const { ObjectID } = require("mongodb");
const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

// Dummy User data.
const users = [{
    _id: userOneId,
    email: "example@example.com",
    password: "useronepass",
    tokens: [{
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
},{
    _id: userTwoId,
    email: "exampletwo@example.com",
    password: "usertwopassword"
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {  // Empties database.
        var userOne = new User(users[0]).save(); // Save the first user.
        var userTwo = new User(users[1]).save(); // Save #2 (returns promise)
        return Promise.all([userOne, userTwo]).then(() => done());
    });
}

module.exports = {
    users,
    populateUsers
}