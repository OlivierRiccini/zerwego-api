"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
// import { UserSchema}  from '../schemas/user-schema';
let UserSchema = new mongoose_1.Schema({
    email: String,
    firstName: String,
    lastName: String
});
exports.User = mongoose.model("User", UserSchema);
exports.default = exports.User;
//# sourceMappingURL=User.js.map