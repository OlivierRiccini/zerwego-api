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
const user_model_1 = require("../models/user-model");
class Authenticate {
    constructor(userDAO, isAdmin) {
        this.userDAO = userDAO;
        this.isAdmin = isAdmin;
        this.userDAO = new user_model_1.UserDAO();
    }
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
// @Middleware()
class AdminOnly extends Authenticate {
    constructor() {
        super(new user_model_1.UserDAO(), true);
    }
}
exports.AdminOnly = AdminOnly;
//# sourceMappingURL=auth-middleware.js.map