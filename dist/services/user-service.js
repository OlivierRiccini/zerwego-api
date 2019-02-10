"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require('debug')('service');
const typedi_1 = require("typedi");
const user_model_1 = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bson_1 = require("bson");
;
let UserService = class UserService {
    constructor(userDAO) {
        this.userDAO = userDAO;
        this.secret = 'abc123';
    }
    ;
    hashPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) {
                            reject(new Error("Something went wrong while hashing password"));
                        }
                        else {
                            resolve(hash);
                        }
                        ;
                    });
                });
            });
        });
    }
    ;
    comparePassword(credentialPassword, userPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                bcrypt.compare(credentialPassword, userPassword, (err, res) => {
                    if (res) {
                        resolve();
                    }
                    else {
                        reject("Wrong password");
                    }
                });
            });
        });
    }
    ;
    generateAuthToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const access = 'auth';
            const token = jwt.sign({ _id: user._id.toHexString(), access }, this.secret).toString();
            user.tokens.push({ access, token });
        });
    }
    ;
    // public async findUserByToken(token: string): Promise<IUser> {
    //     let decoded;
    //     try {
    //         decoded = jwt.verify(token, 'abc123');
    //     } catch (err) {
    //         console.log('err');
    //     };
    //     const results = await this.userDAO.find({
    //         find: {
    //             'id': decoded._id,
    //             'tokens.token': token,
    //             'tokens.access': 'auth'
    //         }
    //     });
    //     if (results.length < 1) {
    //         Promise.reject('User was not found');
    //     };
    //     return results[0];
    // };
    signUp(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = req;
                this.enrichUser(user);
                yield this.generateAuthToken(user);
                user.password = yield this.hashPassword(user);
                user = yield this.userDAO.create(req);
                return this.buildUserResponse(user);
            }
            catch (err) {
                console.log('Smothing went wrong while creating new user');
            }
        });
    }
    ;
    signIn(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let users = yield this.userDAO.find({ find: { email: credentials.email } });
                let user = users[0];
                yield this.comparePassword(credentials.password, user.password);
                yield this.generateAuthToken(user);
                yield this.userDAO.update(user, user.id);
                return this.buildUserResponse(user);
            }
            catch (err) {
                console.log('Err= ' + err);
                throw new Error('Err= ' + err);
            }
        });
    }
    ;
    signOut(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userDAO.findByToken(token);
            yield this.userDAO.removeToken(user.id);
        });
    }
    ;
    buildUserResponse(user) {
        return {
            propToSend: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token: user.tokens[0].token
        };
    }
    ;
    enrichUser(user) {
        user._id = new bson_1.ObjectID;
        user.tokens = [];
    }
    ;
};
UserService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [user_model_1.UserDAO])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user-Service.js.map