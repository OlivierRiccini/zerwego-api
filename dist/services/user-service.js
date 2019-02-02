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
let UserService = class UserService {
    // @Inject() tripDAO: TripDAO;
    constructor(userDAO) {
        this.userDAO = userDAO;
        debug('test');
    }
    generateAuthToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const access = 'auth';
            const token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
            // user.tokens.concat([{access, token}]);
            user.tokens.push({ access, token });
            const updatedUser = yield this.userDAO.update(user, user.id);
            return updatedUser;
            // user.save().then(() => {
            //     return token;
            // });
        });
    }
    createUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.userDAO.create(req).then((user) => {
            //     const 
            //     return user.generateAuthToken();
            // }).then(token => {
            //     return token;
            // })
            const response = yield this.userDAO.create(req);
            const user = yield this.generateAuthToken(response);
            // const user = await this.userDAO.get(response.id);
            // const token = await this.generateAuthToken(user);
            return user;
        });
    }
};
UserService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [user_model_1.UserDAO])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user-Service.js.map