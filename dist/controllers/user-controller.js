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
const user_model_1 = require("../models/user-model");
const user_Service_1 = require("../services/user-Service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
        this.userService = new user_Service_1.UserService(new user_model_1.UserDAO());
    }
    registerUser(user, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userResponse = yield this.userService.register(user);
            const token = userResponse.token;
            const headers = { 'Authorization': token, 'Access-Control-Allow-Headers': 'Authorization' };
            response.header(headers);
            debug('POST /user/register => ' + JSON.stringify(userResponse.propToSend));
            return userResponse.propToSend;
        });
    }
    login(credentials, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userResponse = yield this.userService.login(credentials);
            const token = userResponse.token;
            const headers = { 'Authorization': token, 'Access-Control-Allow-Headers': 'Authorization' };
            response.header(headers);
            debug('POST /user/login => ' + JSON.stringify(userResponse.propToSend));
            return userResponse.propToSend;
        });
    }
    logout(request) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('DELETE /user/logout => User signing out...');
            const token = request.headers['Authorization'];
            yield this.userService.logout(token);
            debug('POST /user/logout => User disconected');
            return 'Disconnected!';
        });
    }
};
__decorate([
    routing_controllers_1.Post('/register'),
    __param(0, routing_controllers_1.Body()), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
__decorate([
    routing_controllers_1.Post('/login'),
    __param(0, routing_controllers_1.Body()), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    routing_controllers_1.Delete('/logout'),
    __param(0, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
UserController = __decorate([
    routing_controllers_1.JsonController('/users'),
    typedi_1.Service(),
    __metadata("design:paramtypes", [user_Service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user-controller.js.map