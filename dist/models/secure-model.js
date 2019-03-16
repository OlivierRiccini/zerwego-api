"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dao_1 = require("../persist/dao");
delete mongoose.connection.models['Secure'];
;
class SecureDAO extends dao_1.DAOImpl {
    constructor() {
        const SecureSchema = new mongoose.Schema({
            id: String,
            refreshToken: String,
            _accessToken: String
        });
        super('Secure', SecureSchema);
    }
}
exports.SecureDAO = SecureDAO;
//# sourceMappingURL=secure-model.js.map