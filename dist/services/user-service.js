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
const auth_service_1 = require("./auth-service");
const routing_controllers_1 = require("routing-controllers");
let UserService = class UserService {
    // @Inject() private messagesService: MessagesService;
    constructor() { }
    updateUser(user, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.emailValidation(user.email, userId);
                yield this.authService.phoneValidation(user.phone, userId);
                return yield this.userDAO.update(user, userId);
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(400, err.message);
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", user_model_1.UserDAO)
], UserService.prototype, "userDAO", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", auth_service_1.AuthService)
], UserService.prototype, "authService", void 0);
UserService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user-service.js.map