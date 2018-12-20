"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class mongooseConfig {
    constructor() {
        this.env = process.env.NODE_ENV || 'development';
    }
    ;
    connect() {
        if (this.env === 'development') {
            process.env.PROD_MONGODB = 'mongodb://localhost:27017/zerwego-mongo';
        }
        else if (this.env === 'test') {
            process.env.PROD_MONGODB = 'mongodb://localhost:27017/zerwego-test';
        }
        mongoose.Promise = global.Promise;
        let connection = mongoose.createConnection(process.env.PROD_MONGODB, { useNewUrlParser: true })
            .then(() => {
            console.log('MONGODB IS CONNECTED!');
        }, (err) => console.log("MONGODB NOT CONNECTED: ", err));
    }
}
exports.mongooseConfig = mongooseConfig;
exports.default = new mongooseConfig();
//  //use q promises
//  global.Promise = require("q").Promise;
//  mongoose.Promise = global.Promise;
// const MONGODB_CONNECTION: string = "mongodb://localhost:27017/heros";
// //connect to mongoose
// let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
//create models
// this.model.user = connection.model<IUserModel>("User", userSchema);
//# sourceMappingURL=mongoose-config.js.map