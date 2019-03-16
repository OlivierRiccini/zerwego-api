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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const debug = require('debug')('http');
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const auth_service_1 = require("../services/auth-service");
const secure_model_1 = require("../models/secure-model");
let AuthController = class AuthController {
    constructor() { }
    registerUser(user, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.authService.register(user);
            const headers = { 'Authorization': token, 'Access-Control-Expose-Headers': '*' };
            response.header(headers);
            debug('POST /user/register => Successfully registered!');
            return 'Successfully registered!';
        });
    }
    login(credentials, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.authService.login(credentials);
            const headers = { 'Authorization': token, 'Access-Control-Expose-Headers': '*' };
            response.header(headers);
            debug('POST /user/login => Successfully logged in!');
            return 'Successfully logged in!';
        });
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.logout(token);
            debug('POST /user/out => Successfully logged out!');
            return 'Successfully logged out!';
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", auth_service_1.AuthService)
], AuthController.prototype, "authService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", secure_model_1.SecureDAO)
], AuthController.prototype, "secureDAO", void 0);
__decorate([
    routing_controllers_1.Post('/register'),
    __param(0, routing_controllers_1.Body()), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    routing_controllers_1.Post('/login'),
    __param(0, routing_controllers_1.Body()), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    routing_controllers_1.Delete('/logout/:token'),
    __param(0, routing_controllers_1.Param('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    routing_controllers_1.JsonController('/auth'),
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth-controller.js.map