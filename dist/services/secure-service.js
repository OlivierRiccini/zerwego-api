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
    generateAuthTokens(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // generateAccessToken
                const accessToken = yield this.generateAccessToken(user);
                // generateRefreshToken(token)
                const refreshToken = yield this.generateRefreshToken(user);
                return { accessToken, refreshToken };
            }
            catch (err) {
                console.log(err);
                throw new routing_controllers_1.HttpError(401, 'Error while generating tokens');
            }
        });
    }
    refreshTokens(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedRefreshToken = jwt.decode(refreshToken);
                console.log(refreshToken);
                const users = yield this.userDAO.find({ find: { id: decodedRefreshToken['payload'].userId } });
                if (users.length <= 0) {
                    throw new routing_controllers_1.HttpError(404, 'User was not found while refreshing tokens');
                }
                if (yield this.refreshTokenIsExpired(refreshToken)) {
                    throw new routing_controllers_1.HttpError(403, 'Refresh token is expired, user has to login');
                }
                else {
                    return this.generateAuthTokens(users[0]);
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
                const decodedRefreshToken = jwt.decode(refreshToken);
                const users = yield this.userDAO.find({ find: { id: decodedRefreshToken['payload'].userId } });
                if (users.length <= 0) {
                    throw new routing_controllers_1.HttpError(404, 'User was not found while refreshing tokens');
                }
                const secret = constants_1.CONSTANTS.REFRESH_TOKEN_SECRET + users[0].password;
                jwt.verify(refreshToken, secret, null);
            }
            catch (err) {
                console.log(err);
                return err.name && err.name === 'TokenExpiredError';
            }
            return false;
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
    generateRefreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = { userId: user.id };
            const refreshSecret = constants_1.CONSTANTS.REFRESH_TOKEN_SECRET + user.password;
            return yield jwt.sign({ payload }, refreshSecret, { expiresIn: '7d' }).toString();
        });
    }
    // public async generateAuthToken(user: IUser): Promise<any> {
    //     try {
    //         const payload = {
    //             id: user.id,
    //             name: user.name,
    //             email: user.email,
    //         };
    //         const access_token = await jwt.sign({payload}, CONSTANTS.JWT_SECRET, { expiresIn: '10s' }).toString();
    //         const refreshToken = await this.findRefreshTokenByTokenOrUserId(user.id, null);
    //         if (!refreshToken) {
    //             await this.generateRefreshToken(user, access_token);
    //         } else {
    //             await this.updateRefreshToken(refreshToken, access_token);
    //         }
    //         return access_token;
    //     } catch (err) {
    //         throw new HttpError(401, err);
    //     }
    // };
    // async generateRefreshToken(user: IUser, _accessToken: string): Promise<void> {
    //     const payload = { user, _accessToken };
    //     const refreshToken = await jwt.sign({payload}, CONSTANTS.JWT_SECRET, { expiresIn: '7d' }).toString();
    //     await this.secureDAO.create({refreshToken, _accessToken, _userId: user.id});
    // }
    // async updateRefreshToken(refreshToken: ISecure, access_token: string) {
    //     try {
    //         console.log('updateRefreshToken');
    //         refreshToken._accessToken = access_token;
    //         await this.secureDAO.update(refreshToken, refreshToken.id);
    //     } catch (err) {
    //         throw new HttpError(400, err);
    //     }
    // }
    // async refreshToken(expiredToken: string) {
    //     try {
    //         console.log('refreshToken');
    //         let refreshToken = await this.findRefreshTokenByTokenOrUserId(expiredToken);
    //         console.log(refreshToken);
    //         if (!refreshToken) {
    //             throw new Error('No refresh token was found for this token');
    //         }
    //         if (this.tokenIsExpired(refreshToken)) {
    //             await this.secureDAO.delete(refreshToken.id);
    //             throw new Error('Refresh token is exipred, user has to login');
    //         }
    //         const user = refreshToken['payload'].user;
    //         console.log(user);
    //         const newToken = await this.generateAuthToken(user);
    //         return newToken;
    //     } catch (err) {
    //         throw new HttpError(401, err);
    //     }
    // }
    // tokenIsExpired(token): boolean {
    //     try {
    //         jwt.verify(token, CONSTANTS.JWT_SECRET, null)
    //     } catch (err) {
    //         return err.name && err.name === 'TokenExpiredError'
    //     }
    //     return false;
    // }
    // async findRefreshTokenByTokenOrUserId(userId?: string, token?: string) {
    //     let tokens: ISecure[];
    //     if (token) {
    //         tokens = await this.secureDAO.find({find:{_accessToken: token}});
    //     } else {
    //         tokens = await this.secureDAO.find({find:{_userId: userId}});
    //     }
    //     return tokens.length <= 0 ? null : tokens[0];
    // }
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