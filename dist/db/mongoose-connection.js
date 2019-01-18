"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class MongooseConnection {
    init() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
            .then(() => console.log(`Successfully connected DB: ${process.env.MONGODB_URI}`))
            .catch((err) => console.log(err));
    }
}
exports.MongooseConnection = MongooseConnection;
//# sourceMappingURL=mongoose-connection.js.map