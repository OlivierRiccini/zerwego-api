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
const routing_controllers_1 = require("routing-controllers");
const user_Service_1 = require("../services/user-Service");
const user_model_1 = require("../models/user-model");
// @Middleware({ type: "before" })
class Authenticate {
    constructor(userDAO, userService) {
        this.userDAO = userDAO;
        this.userService = userService;
        this.secret = 'abc123';
        this.userDAO = new user_model_1.UserDAO();
        this.userService = new user_Service_1.UserService(userDAO);
    }
    use(request, response, next) {
        // const token = request.headers['x-auth'];
        // this.authenticate(request, response, next);
        var token = request.header('x-auth');
        this.userDAO.findByToken(token).then((user) => {
            if (!user) {
                // throw new Error('User was not found');
                // response.status(401).send('User was not found');
                return Promise.reject();
            }
            console.log(user);
            request.user = user;
            request.token = token;
            next();
        }).catch((e) => {
            // throw new Error(e);
            response.status(401).send(e);
        });
        next();
    }
    authenticate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var token = request.header('x-auth');
            this.userDAO.findByToken(token).then((user) => {
                if (!user) {
                    // throw new Error('User was not found');
                    // response.status(401).send('User was not found');
                    return Promise.reject();
                }
                request.user = user;
                request.token = token;
                next();
            }).catch((e) => {
                // throw new Error(e);
                response.status(401).send(e);
            });
        });
    }
}
__decorate([
    __param(0, routing_controllers_1.Req()), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Object)
], Authenticate.prototype, "use", null);
exports.Authenticate = Authenticate;
//# sourceMappingURL=auth-middleware.js.map