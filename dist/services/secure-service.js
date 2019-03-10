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
const typedi_1 = require("typedi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const constants_1 = require("../persist/constants");
const routing_controllers_1 = require("routing-controllers");
const secure_model_1 = require("../models/secure-model");
let SecureService = class SecureService {
    constructor(secureDAO) {
        this.secureDAO = secureDAO;
    }
    ;
    generateAuthToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = yield this.findRefreshTokenByUserId(user.id);
                if (!refreshToken) {
                    yield this.generateRefreshToken(user.id);
                }
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
                const access_token = yield jwt.sign({ payload }, constants_1.CONSTANTS.JWT_SECRET, { expiresIn: '60s' }).toString();
                return access_token;
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(401, err);
            }
        });
    }
    ;
    generateRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const refresh_token = yield jwt.sign({ _userId: userId }, constants_1.CONSTANTS.JWT_SECRET, { expiresIn: '7d' }).toString();
            yield this.secureDAO.create({ refresh_token, _userId: userId });
        });
    }
    refreshToken(expiredToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedExpiredToken = jwt.verify(expiredToken, constants_1.CONSTANTS.JWT_SECRET, null);
                const userId = decodedExpiredToken['payload'].id;
                const refreshToken = yield this.findRefreshTokenByUserId(userId);
                if (!refreshToken) {
                    throw new Error('No refresh token was found for this token');
                }
                if (this.tokenIsExpired(refreshToken)) {
                    yield this.secureDAO.delete(refreshToken.id);
                    throw new Error('Refresh token is exipred, user has to login');
                }
                const user = decodedExpiredToken['payload'];
                const newToken = yield this.generateAuthToken(user);
                return newToken;
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(401, err);
            }
        });
    }
    tokenIsExpired(token) {
        const decodedToken = jwt.verify(token, constants_1.CONSTANTS.JWT_SECRET, null);
        const dateNow = new Date();
        return decodedToken['exp'] < dateNow.getTime() / 1000;
    }
    findRefreshTokenByUserId(UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.secureDAO.find({ find: { _userId: UserId } });
            return tokens.length <= 0 ? null : tokens[0];
        });
    }
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
};
SecureService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [secure_model_1.SecureDAO])
], SecureService);
exports.SecureService = SecureService;
//# sourceMappingURL=secure-service.js.map