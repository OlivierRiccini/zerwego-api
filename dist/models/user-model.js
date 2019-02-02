"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dao_1 = require("../persist/dao");
const validator_1 = require("validator");
// const {SHA256} = require('crypto-js');
// import {SHA256} as crypto from 'crypto-js';
const crypto_js_1 = require("crypto-js");
// const hash = SHA256()
const data = {
    id: 4
};
let token = {
    data,
    hash: crypto_js_1.SHA256(JSON.stringify(data) + 'somesecret').toString()
};
const resultHash = crypto_js_1.SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
if (resultHash === token.hash) {
    console.log('Data was not changed');
}
else {
    console.log('Data was changed do not trust');
}
delete mongoose.connection.models['Trip'];
;
class UserDAO extends dao_1.DAOImpl {
    constructor() {
        const UserSchema = new mongoose.Schema({
            id: String,
            name: String,
            email: {
                type: String,
                required: true,
                trim: true,
                unique: true,
                validate: {
                    validator: validator_1.default.isEmail,
                    message: '{VALUE} is not a valid email'
                }
            },
            password: {
                type: String,
                require: true,
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
                }]
        });
        super('User', UserSchema);
    }
}
exports.UserDAO = UserDAO;
//# sourceMappingURL=user-model.js.map