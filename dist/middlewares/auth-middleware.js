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
const routing_controllers_1 = require("routing-controllers");
const user_model_1 = require("../models/user-model");
const trip_model_1 = require("../models/trip-model");
const jwt = require("jsonwebtoken");
class Authenticate {
    constructor(userDAO, tripDAO, isAdmin) {
        this.userDAO = userDAO;
        this.tripDAO = tripDAO;
        this.isAdmin = isAdmin;
        this.secret = process.env.JWT_SECRET;
        this.userDAO = new user_model_1.UserDAO();
        this.tripDAO = new trip_model_1.TripDAO();
    }
    use(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var token = request.header('x-auth');
            try {
                if (!token) {
                    throw new routing_controllers_1.HttpError(401, 'Only administrator can perform this task');
                }
                const decoded = jwt.verify(token, this.secret, null);
                if (typeof decoded === 'undefined') {
                    throw new routing_controllers_1.HttpError(401, 'Only administrator can perform this task');
                }
                ;
                const user = decoded['user'];
                const expirationToken = decoded['ita'];
                if (!user) {
                    throw new routing_controllers_1.HttpError(401, 'Only administrator can perform this task');
                }
                ;
                if (request.url.includes('/trips') && this.isAdmin) {
                    const tripId = request.params.id;
                    const isTripAdmin = yield this.isUserTripAdmin(user.id, tripId);
                    if (!isTripAdmin) {
                        throw new routing_controllers_1.HttpError(401, 'Only administrator can perform this task');
                    }
                    ;
                }
                request.user = user;
                request.token = token;
                //    if (Date.now() / 1000 > expirationToken) {
                //         return false;
                //     }
                next();
            }
            catch (err) {
                response.status(err.httpCode).send(err);
            }
        });
    }
    isUserTripAdmin(userId, tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.tripDAO.find({ find: {
                    id: tripId,
                    adminId: userId
                } });
            return result.length > 0;
        });
    }
}
exports.Authenticate = Authenticate;
// @Middleware()
class AdminOnly extends Authenticate {
    constructor() {
        super(new user_model_1.UserDAO(), new trip_model_1.TripDAO(), true);
    }
}
exports.AdminOnly = AdminOnly;
//# sourceMappingURL=auth-middleware.js.map