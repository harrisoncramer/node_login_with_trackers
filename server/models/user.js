const _ = require("lodash");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { ObjectID } = require("mongodb");
const { CourtCaseSchema, TwitterSchema, LegislationSchema } = require("./trackerSchemas");
const axios = require("axios");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    trackers: {
        tweets: {
            type: [TwitterSchema],
            default: null
        },
        legislation: {
            type: [LegislationSchema],
            default: null
        },
        court_cases: {
            type: [CourtCaseSchema],
            default: null
        }
    }
});

UserSchema.methods.toJSON = function() {
    var user = this; // The model
    var userObject = user.toObject(); // Converts mongoose model to object, it's a method of model

    userObject;
    return _.pick(userObject, ['_id', 'email', 'frequency']); // Return object w/ just _id and email
};


// Returns a promise that resolves with the signed user token.
UserSchema.methods.generateAuthToken = function () { // Where our instance methods live. They have access to the original document.
    var user = this; // This document.
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString(); // salt it!

    // user.tokens.push({access, token});
    user.tokens = user.tokens.concat([{access, token}]); // Push is inconsistent across versions.

    return user.save().then(() => {
        return token; // Token is success argument for next then call
    });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;
    return user.update({
        $pull : {
            tokens: { token }
        }
    });
};

UserSchema.statics.findByToken = function(token) {
    var User = this; // The model, not the instance of that model.
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET); // Will send to catch block if this fails, the rest will not run.
    } catch (e) {
        return Promise.reject();// This promise will be returned instead of our token.
    }

    return User.findOne({  // This will return a promise. We're looking for an instance of a User model that matches the criteria here. Quotes are used because we need to search within a nested object.
        '_id' : decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    });
} // Statics creates model methods, NOT instance methods

UserSchema.statics.findByCredentials = function(email,password){
    var User = this;
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve,reject) => {
            bcrypt.compare(password,user.password, (err,res) => {
                res ? resolve(user) : reject(err)
            });
        });
    }).catch((e) => {
        return Promise.reject(e);
    })
}

UserSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')) { // the .isModified method checks if a property has been changed. The middleware will run everytime anything is changed (like email, for example) but this will only run when the password property has been changed.
        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(user.password,salt,(err,hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next(); // Move on to route.
    }
})

var User = mongoose.model("User", UserSchema);

module.exports = {
    User
}