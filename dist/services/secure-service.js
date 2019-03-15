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
const user_model_1 = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const constants_1 = require("../persist/constants");
const routing_controllers_1 = require("routing-controllers");
const secure_model_1 = require("../models/secure-model");
;
let SecureService = class SecureService {
    constructor(secureDAO) {
        this.secureDAO = secureDAO;
    }
    ;
    generateAuthTokens(user, refreshing, secureId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.generateAccessToken(user);
                const refreshToken = yield this.generateRefreshToken(accessToken, user);
                if (!refreshing) {
                    yield this.secureDAO.create({ refreshToken, _accessToken: accessToken });
                }
                else {
                    yield this.secureDAO.update({ refreshToken, _accessToken: accessToken }, secureId);
                }
                return { refreshToken, accessToken };
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(401, 'Error while generating tokens');
            }
        });
    }
    refreshTokens(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const secure = yield this.findISecureByAccessToken(token);
                const refreshToken = secure.refreshToken;
                // console.log('refreshToken');
                // console.log(refreshToken);
                if (yield this.refreshTokenIsExpired(refreshToken)) {
                    throw new routing_controllers_1.HttpError(403, 'Refresh token is expired, user has to login');
                }
                else {
                    const decodedRefreshToken = jwt.decode(refreshToken);
                    // console.log('decodedRefreshToken');
                    // console.log(decodedRefreshToken);
                    const userId = jwt.decode(decodedRefreshToken['payload'].accessToken)['payload'].id;
                    // console.log('userId');
                    // console.log(userId);
                    const users = yield this.userDAO.find({ find: { id: userId } });
                    if (users.length <= 0) {
                        throw new routing_controllers_1.HttpError(404, 'User was not found while refreshing tokens');
                    }
                    const tokens = yield this.generateAuthTokens(users[0], true, secure.id);
                    // await this.secureDAO.update(
                    //     {refreshToken: tokens.refreshToken, _accessToken: tokens.accessToken},
                    //     secure.id
                    // );
                    return tokens.accessToken;
                }
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(400, err);
            }
        });
    }
    accessTokenIsExpired(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield jwt.verify(token, constants_1.CONSTANTS.ACCESS_TOKEN_SECRET, null);
            }
            catch (err) {
                return err.name && err.name === 'TokenExpiredError';
            }
            return false;
        });
    }
    refreshTokenIsExpired(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('IN EXIPRED REFRESH TOKEN');
                const decodedRefreshToken = jwt.decode(refreshToken);
                // console.log(decodedRefreshToken);
                const users = yield this.userDAO.find({ find: { id: decodedRefreshToken['payload'].userId } });
                if (users.length <= 0) {
                    throw new routing_controllers_1.HttpError(404, 'User was not found while refreshing tokens');
                }
                const secret = constants_1.CONSTANTS.REFRESH_TOKEN_SECRET + users[0].password;
                // console.log('IN EXIPRED REFRESH TOKEN - PASSWORD');
                // console.log(users[0].password);
                jwt.verify(refreshToken, secret, null);
            }
            catch (err) {
                // console.log('IN EXIPRED REFRESH TOKEN - ERROR');
                // console.log(err);
                return err.name && err.name === 'TokenExpiredError';
            }
            return false;
        });
    }
    findISecureByAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('accessToken');
            console.log(accessToken);
            const results = yield this.secureDAO.find({ find: { _accessToken: accessToken } });
            console.log('RESULTS');
            console.log(results);
            return results.length > 0 ? results[0] : null;
        });
    }
    generateAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
            };
            return yield jwt.sign({ payload }, constants_1.CONSTANTS.ACCESS_TOKEN_SECRET, { expiresIn: '10s' }).toString();
        });
    }
    generateRefreshToken(accessToken, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = { accessToken, userId: user.id };
            const refreshSecret = constants_1.CONSTANTS.REFRESH_TOKEN_SECRET + user.password;
            const refreshToken = yield jwt.sign({ payload }, refreshSecret, { expiresIn: '30s' }).toString();
            return refreshToken;
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
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", user_model_1.UserDAO)
], SecureService.prototype, "userDAO", void 0);
SecureService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [secure_model_1.SecureDAO])
], SecureService);
exports.SecureService = SecureService;
//# sourceMappingURL=secure-service.js.map