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
const validator_1 = require("validator");
const generator = require('generate-password');
let AuthService = class AuthService {
    constructor() { }
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = req;
                // const nonHashedPassword = user.password;
                user.password = yield this.secureService.hashPassword(user);
                if (user.email) {
                    yield this.emailValidation(user.email);
                }
                ;
                if (user.phone) {
                    yield this.phoneValidation(user.phone);
                }
                ;
                user = yield this.userDAO.create(req);
                const tokens = yield this.secureService.generateAuthTokens(user);
                // await this.messagesService.sendSMS({
                //     phone: '+14383991332',
                //     content: `Welcome: ${user.name.toUpperCase()}! We generated a new password for you: ${nonHashedPassword}`
                // });
                return tokens;
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(400, err.message);
            }
        });
    }
    ;
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validateLoginType(credentials);
                const emailOrPhone = this.defineEmailOrPhone(credentials);
                this.validateProvidedCredentials(credentials);
                const query = emailOrPhone === 'email' ? { find: { email: credentials.email } } : { find: { phone: credentials.phone } };
                let users = yield this.userDAO.find(query);
                if (!users || users.length <= 0) {
                    throw new Error('User was not found while login');
                }
                let user = users[0];
                if (credentials.type === 'password') {
                    yield this.secureService.comparePassword(credentials.password, user.password);
                }
                const tokens = yield this.secureService.generateAuthTokens(user);
                return tokens;
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(400, err.message);
            }
        });
    }
    ;
    refreshTokens(refreshToken, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userDAO.get(userId);
                yield this.secureService.validateRefreshToken(refreshToken);
                const tokens = yield this.secureService.generateAuthTokens(user);
                return tokens;
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(401, err.message);
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
    isEmailAlreadyTaken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userDAO.find({ find: { email } });
            return users.length > 0;
        });
    }
    isPhoneAlreadyTaken(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userDAO.find({ find: { phone } });
            return users.length > 0;
        });
    }
    emailValidation(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isEmailAlreadyTaken(email)) {
                throw new Error('Email address already belongs to an account');
            }
            if (!validator_1.default.isEmail(email)) {
                throw new Error('Email address provided is not valid');
            }
        });
    }
    phoneValidation(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isPhoneAlreadyTaken(phone)) {
                throw new Error('Phone number already belongs to an account');
            }
            if (!validator_1.default.isMobilePhone(phone, 'any', { strictMode: true })) {
                throw new Error('Phone number provided is not valid');
            }
        });
    }
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
    defineEmailOrPhone(credentials) {
        if (this.credentialsHadEmail(credentials)) {
            return 'email';
        }
        if (!this.credentialsHadEmail(credentials) && this.credentialsHasPhone(credentials)) {
            return 'phone';
        }
        if (!this.credentialsHadEmail(credentials) && !this.credentialsHasPhone(credentials)) {
            throw new routing_controllers_1.HttpError(400, 'User credentials should at least contain an email or a phone property');
        }
    }
    validateProvidedCredentials(credentials) {
        if (this.credentialsHadEmail(credentials) && !validator_1.default.isEmail(credentials.email)) {
            throw new Error('Provided email is not valid');
        }
        if (this.credentialsHasPhone(credentials)
            && !validator_1.default.isMobilePhone(credentials.phone, 'any', { strictMode: true })) {
            throw new Error('Provided phone number is not valid');
        }
    }
    credentialsHadEmail(credentials) {
        return credentials.hasOwnProperty('email') && !!credentials.email;
    }
    credentialsHasPhone(credentials) {
        return credentials.hasOwnProperty('phone') && !!credentials.phone;
    }
    validateLoginType(credentials) {
        if (!credentials.hasOwnProperty('type') || credentials.type !== 'password' && credentials.type !== 'facebook') {
            throw new Error('Credentials should have a property type equal either \'password\' or \'facebook\'');
        }
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