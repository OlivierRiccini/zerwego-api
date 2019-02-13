"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dao_1 = require("../persist/dao");
const validator_1 = require("validator");
const jwt = require("jsonwebtoken");
const debug = require('debug')('DAO');
delete mongoose.connection.models['User'];
;
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
    findByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var decoded;
            try {
                decoded = jwt.verify(token, 'abc123');
            }
            catch (e) {
                throw new Error(e);
            }
            const users = yield this.find({
                find: {
                    '_id': decoded._id,
                    'tokens.token': token,
                    'tokens.access': 'auth'
                }
            });
            return users[0];
        });
    }
    ;
    removeToken(id) {
        return new Promise((resolve, reject) => {
            this.model.findById(id).exec((err, user) => {
                if (err) {
                    reject(err);
                }
                ;
                if (!user) {
                    reject('Removing token: User was not found');
                }
                ;
                user.tokens = [];
                user.save((err, user) => {
                    if (err) {
                        debug('removeToken - FAILED => ' + JSON.stringify(err));
                        reject(err);
                    }
                    ;
                    debug('removeToken - OK');
                    resolve(user.toObject());
                });
            });
        });
    }
    ;
}
exports.UserDAO = UserDAO;
//# sourceMappingURL=user-model.js.map