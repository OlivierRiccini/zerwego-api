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
const trip_model_1 = require("../models/trip-model");
const user_model_1 = require("../models/user-model");
let TripService = class TripService {
    // @Inject() tripDAO: TripDAO;
    constructor(tripDAO, userDAO) {
        this.tripDAO = tripDAO;
        this.userDAO = userDAO;
        debug('test');
    }
    findTrips(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userDAO.findByToken(token);
            return this.tripDAO.find({
                find: {
                    userIds: user.id
                }
            });
        });
    }
    findById(id) {
        return this.tripDAO.get(id);
    }
    createTrip(trip) {
        return this.tripDAO.create(trip);
    }
    updateTrip(trip, id) {
        return this.tripDAO.update(trip, id);
    }
    deleteTrip(id) {
        return this.tripDAO.delete(id);
    }
};
TripService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [trip_model_1.TripDAO, user_model_1.UserDAO])
], TripService);
exports.TripService = TripService;
//# sourceMappingURL=trip-service.js.map