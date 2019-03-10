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
const secure_service_1 = require("../services/secure-service");
let Authenticate = class Authenticate {
    constructor(isAdmin) {
        this.isAdmin = isAdmin;
    }
    use(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = request.header('Authorization');
            try {
                if (!token) {
                    throw new routing_controllers_1.HttpError(401, 'No authorization token provided');
                }
                if (token.startsWith('Bearer ')) {
                    // Remove Bearer from string
                    token = token.slice(7, token.length);
                }
                if (token && this.secureService.tokenIsExpired(token)) {
                    console.log('middleware');
                    token = yield this.secureService.refreshToken(token);
                }
                const decoded = jwt.verify(token, constants_1.CONSTANTS.JWT_SECRET, null);
                if (typeof decoded === 'undefined') {
                    throw new routing_controllers_1.HttpError(401, 'Authorizationt token cannot be decoded');
                }
                ;
                const user = decoded['payload'];
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
                request.user = user;
                request.token = token;
                response.set('Authorization', token);
                next();
            }
            catch (err) {
                response.status(err.httpCode ? err.httpCode : 401).send(err);
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
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", secure_service_1.SecureService)
], Authenticate.prototype, "secureService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", trip_model_1.TripDAO)
], Authenticate.prototype, "tripDAO", void 0);
Authenticate = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Boolean])
], Authenticate);
exports.Authenticate = Authenticate;
// @Middleware()
class AdminOnly extends Authenticate {
    constructor() {
        super(true);
    }
}
exports.AdminOnly = AdminOnly;
//# sourceMappingURL=auth-middleware.js.map