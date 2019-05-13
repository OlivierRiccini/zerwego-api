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
const routing_controllers_1 = require("routing-controllers");
const secure_service_1 = require("./secure-service");
const messages_service_1 = require("./messages-service");
const generator = require('generate-password');
let AuthService = class AuthService {
    constructor() { }
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = req;
                const nonHashedPassword = user.password;
                user.password = yield this.secureService.hashPassword(user);
                user = yield this.userDAO.create(req);
                const tokens = yield this.secureService.generateAuthTokens(user);
                // await this.messagesService.sendSMS({
                //     phone: '+14383991332',
                //     content: `Welcome: ${user.name.toUpperCase()}! We generated a new password for you: ${nonHashedPassword}`
                // });
                return tokens;
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(400, 'Smothing went wrong while creating new user');
            }
        });
    }
    ;
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let users = yield this.userDAO.find({ find: { email: credentials.email } });
                let user = users[0];
                if (credentials.type === 'password') {
                    yield this.secureService.comparePassword(credentials.password, user.password);
                }
                const tokens = yield this.secureService.generateAuthTokens(user);
                return tokens;
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(400, err);
            }
        });
    }
    ;
    refreshTokens(refreshToken, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('"""""""""""""""""""" 1 """""""""""""""""""""""');
                const user = yield this.userDAO.get(userId);
                console.log(user);
                const refreshTokenIsExpired = yield this.secureService.refreshTokenIsExpired(refreshToken);
                console.log('""""""""""""""""""" 3 """""""""""""""""""""""');
                console.log(refreshTokenIsExpired);
                if (refreshTokenIsExpired) {
                    // console.log('Refresh token is no longer valid, user has to login');
                    throw new routing_controllers_1.HttpError(401, 'Refresh token is no longer valid, user has to login');
                }
                const tokens = yield this.secureService.generateAuthTokens(user);
                return tokens;
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(err.httpCode, err.message);
            }
        });
    }
    forgotPassword(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.generateNewPassword(contact);
                switch (contact.type) {
                    case 'email':
                        yield this.messagesService.sendEmail({
                            from: 'info@olivierriccini.com',
                            to: contact.email,
                            subject: 'New Password',
                            content: `Hey ${result.user.username.toUpperCase()}, this is your new password: ${result.newPassword}. You can go to your profile to change it`
                        });
                        break;
                    case 'sms':
                        yield this.messagesService.sendSMS({
                            phone: contact.phone,
                            content: `Hey ${result.user.username.toUpperCase()}, this is your new password: ${result.newPassword}. You can go to your profile to change it`
                        });
                        break;
                    default:
                        throw new routing_controllers_1.BadRequestError('Something went wrong while reinitilizing password');
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    handleFacebookLogin(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userDAO.find({ find: { email: credentials.email } });
            const password = generator.generate({
                length: 10,
                numbers: true
            });
            if (users && users.length < 1) {
                const newUser = {
                    username: credentials.username,
                    email: credentials.email,
                    password,
                    facebookId: credentials.facebookId
                };
                return yield this.register(newUser);
            }
            let user = users[0];
            if (!user.facebookId) {
                user.facebookId = credentials.facebookId;
                yield this.userDAO.update(user, user.id);
            }
            return yield this.login(credentials);
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.secureService.removeRefreshToken(refreshToken);
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(400, err);
            }
        });
    }
    ;
    generateNewPassword(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = contact.type === 'email' ? { email: contact.email } : { phone: contact.phone };
            const users = yield this.userDAO.find({ find: query });
            if (!users || users.length < 1 || users.length > 1) {
                throw new routing_controllers_1.HttpError(400, 'No user or more than one user found during password reinitilization process');
            }
            const user = users[0];
            const newPassword = generator.generate({
                length: 10,
                numbers: true
            });
            user.password = newPassword;
            user.password = yield this.secureService.hashPassword(user);
            yield this.userDAO.update(user, user.id);
            return { newPassword, user };
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", secure_service_1.SecureService)
], AuthService.prototype, "secureService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", user_model_1.UserDAO)
], AuthService.prototype, "userDAO", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", messages_service_1.MessagesService)
], AuthService.prototype, "messagesService", void 0);
AuthService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth-service.js.map