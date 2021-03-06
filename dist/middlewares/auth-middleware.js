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
const routing_controllers_1 = require("routing-controllers");
const trip_model_1 = require("../models/trip-model");
const jwt = require("jsonwebtoken");
const typedi_1 = require("typedi");
const constants_1 = require("../persist/constants");
let Authenticate = class Authenticate {
    constructor(isAdmin) {
        this.isAdmin = isAdmin;
    }
    use(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let accessToken = request.header('Authorization');
            // console.log('///////////////////// 1 ////////////////////////////');
            // console.log(accessToken);
            try {
                if (!accessToken) {
                    throw new routing_controllers_1.HttpError(401, 'No authorization token provided');
                }
                if (accessToken.startsWith('Bearer ')) {
                    // Remove Bearer from string
                    accessToken = accessToken.slice(7, accessToken.length);
                }
                const decoded = jwt.verify(accessToken, constants_1.CONSTANTS.ACCESS_TOKEN_SECRET, null);
                // console.log('///////////////////// 2 //////////////////////////////');
                if (typeof decoded === 'undefined') {
                    throw new routing_controllers_1.HttpError(401, 'Authorizationt token cannot be decoded');
                }
                ;
                const user = decoded['payload'];
                // console.log('//////////////////// 3 //////////////////////////////');
                if (!user) {
                    throw new routing_controllers_1.HttpError(401, 'This token is not related to any user');
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
                // console.log('//////////////////// 4 //////////////////////////////');
                // console.log(accessToken);
                request.user = user;
                request.token = accessToken;
                next();
            }
            catch (err) {
                response.status(err.httpCode ? err.httpCode : 401).send(err);
            }
        });
    }
    isUserTripAdmin(userId, tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trip = yield this.tripDAO.get(tripId);
                if (!trip) {
                    return false;
                }
                const user = trip.participants.find(user => user.userId === userId);
                if (!user) {
                    return false;
                }
                if (user && user.isAdmin) {
                    return true;
                }
                return false;
            }
            catch (err) {
                throw new routing_controllers_1.HttpError(401, 'User not found during trip admin checking');
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", trip_model_1.TripDAO)
], Authenticate.prototype, "tripDAO", void 0);
Authenticate = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Boolean])
], Authenticate);
exports.Authenticate = Authenticate;
class AdminOnly extends Authenticate {
    constructor() {
        super(true);
    }
}
exports.AdminOnly = AdminOnly;
//# sourceMappingURL=auth-middleware.js.map