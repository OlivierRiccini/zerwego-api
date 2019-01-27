"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dao_1 = require("../persist/dao");
delete mongoose.connection.models['Trip'];
;
class UserDAO extends dao_1.DAOImpl {
    constructor() {
        const UserSchema = new mongoose.Schema({
            id: String,
            name: String,
            email: String,
            password: String
        });
        super('User', UserSchema);
    }
}
exports.UserDAO = UserDAO;
//# sourceMappingURL=user-model.js.map