"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const debug = require('debug')('data-base');
class MongooseConnection {
    init() {
        mongoose.Promise = global.Promise;
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
            .then(() => debug(`Successfully connected DB: ${process.env.MONGODB_URI}`))
            .catch((err) => debug(err));
    }
}
exports.MongooseConnection = MongooseConnection;
//# sourceMappingURL=mongoose-connection.js.map