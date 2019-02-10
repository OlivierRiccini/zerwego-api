"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    // use(request: any, response: any, next?: (err?: any) => any) {
    //     // const token = request.headers['x-auth'];
    //     this.authenticate(request, response, next);
    //     next();
    // }
    use(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authenticate(request, response, next);
        });
    }
    authenticate(request, response, next) {
        var token = request.header('x-auth');
        this.userDAO.findByToken(token).then((user) => {
            if (!user) {
                response.status(401).send('User was not found');
                return;
            }
            ;
            request.user = user;
            request.token = token;
            next();
        }).catch((e) => {
            response.status(401).send('opopopopo');
            return;
        });
    }
}
exports.Authenticate = Authenticate;
//# sourceMappingURL=auth-middleware.js.map