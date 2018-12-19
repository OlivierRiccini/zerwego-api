"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const user_dao_1 = require("../schemas/user-dao");
//use q promises
global.Promise = require("q").Promise;
//import mongoose
const mongoose = require("mongoose");
//use q library for mongoose promise
mongoose.Promise = global.Promise;
//connect to mongoose and create model
const MONGODB_CONNECTION = "mongodb://localhost:27017/heros";
let connection = mongoose.createConnection(MONGODB_CONNECTION);
var User = connection.model("User", user_dao_1.userSchema);
//require chai and use should() assertions
let chai = require("chai");
chai.should();
describe("User", function () {
    describe("create()", function () {
        it("should create a new User", function () {
            //user object
            let user = {
                email: "foo@bar.com",
                firstName: "Brian",
                lastName: "Love"
            };
            //create user and return promise
            return new User(user).save().then(result => {
                //verify _id property exists
                result._id.should.exist;
                //verify email
                result.email.should.equal(user.email);
                //verify firstName
                result.firstName.should.equal(user.firstName);
                //verify lastName
                result.lastName.should.equal(user.lastName);
            });
        });
    });
});
//# sourceMappingURL=user-test.js.map