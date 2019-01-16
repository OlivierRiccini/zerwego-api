"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class MongooseConnection {
    init() {
        mongoose.Promise = global.Promise;
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
            .then(() => console.log("SUCCES"))
            .catch((err) => console.log(err));
    }
}
exports.MongooseConnection = MongooseConnection;
//# sourceMappingURL=mongoose.js.map