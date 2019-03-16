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
let AuthService = class AuthService {
    constructor() { }
    ;
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = req;
                user.password = yield this.secureService.hashPassword(user);
                user = yield this.userDAO.create(req);
                const tokens = yield this.secureService.generateAuthTokens(user);
                return tokens.accessToken;
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
                yield this.secureService.comparePassword(credentials.password, user.password);
                const tokens = yield this.secureService.generateAuthTokens(user);
                return tokens.accessToken;
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(400, err);
            }
        });
    }
    ;
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.secureService.removeSecure(token);
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(400, err);
            }
        });
    }
    ;
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", secure_service_1.SecureService)
], AuthService.prototype, "secureService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", user_model_1.UserDAO)
], AuthService.prototype, "userDAO", void 0);
AuthService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth-service.js.map