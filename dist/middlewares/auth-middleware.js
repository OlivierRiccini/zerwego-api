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
const trip_model_1 = require("../models/trip-model");
class Authenticate {
    constructor(userDAO, tripDAO, isAdmin) {
        this.userDAO = userDAO;
        this.tripDAO = tripDAO;
        this.isAdmin = isAdmin;
        this.userDAO = new user_model_1.UserDAO();
        this.tripDAO = new trip_model_1.TripDAO();
        // this.isAdmin = isAdmin;
    }
    use(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authenticate(request, response, next);
        });
    }
    authenticate(request, response, next) {
        var token = request.header('x-auth');
        this.userDAO.findByToken(token).then((user) => __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                response.status(401).send('User was not found');
                return;
            }
            ;
            // console.log('ABLLAAAAAa ' + request + this.isAdmin);
            if (request.url.includes('/trips') && this.isAdmin) {
                // console.log(user);
                const isAdminOfThisTrip = yield this.isUserTripAdmin(user.id, request.params.id);
                // console.log('ABLLAAAAAa ' + isAdminOfThisTrip);
            }
            ;
            if (this.isAdmin && user)
                request.user = user;
            request.token = token;
            next();
        })).catch((e) => {
            response.status(401).send('opopopopo');
            return;
        });
    }
    isUserTripAdmin(userId, tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('user ' + userId);
            // console.log('trip ' + tripId);
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