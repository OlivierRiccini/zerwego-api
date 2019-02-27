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
    }
    use(request, response, next) {
        // var token = request.header('x-auth');
        // this.userDAO.findByToken(token).then( async (user) => {
        //     if (!user) {
        //         throw new NotFoundError('User not authenticated');
        //     };
        //     if (request.url.includes('/trips')) {
        //         const tripId: string = request.params.id;
        //         if (this.isAdmin && !(await this.isUserTripAdmin(user.id, tripId))) {               
        //             throw new HttpError(401, 'Only administrator can perform this task');
        //         };
        //     }
        //     request.user = user;
        //     request.token = token;
        //     next();
        // }).catch((err) => {
        //     response.status(err.httpCode).send(err);
        // });
        const bearerHeader = request.header('authorization');
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            request.token = bearerToken;
            next();
        }
        else {
            // response.status(err.httpCode).send(err);
            console.log('err');
        }
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