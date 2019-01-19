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
const trip_Service_1 = require("../services/trip-Service");
let TripController = class TripController {
    constructor(tripService) {
        this.tripService = tripService;
        this.tripService = new trip_Service_1.TripService();
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let trips = yield this.tripService.fetchAll();
            //  console.log(trips);
            return trips;
        });
    }
    addTrip(trip, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tripService.createTrip(request.body);
        });
    }
    deleteTrip(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(id);
            return this.tripService.deleteTrip(id);
        });
    }
};
__decorate([
    routing_controllers_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TripController.prototype, "getAll", null);
__decorate([
    routing_controllers_1.Post(),
    __param(0, routing_controllers_1.Body()), __param(1, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "addTrip", null);
__decorate([
    routing_controllers_1.Delete('/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TripController.prototype, "deleteTrip", null);
TripController = __decorate([
    routing_controllers_1.JsonController('/trips'),
    __metadata("design:paramtypes", [trip_Service_1.TripService])
], TripController);
exports.TripController = TripController;
//# sourceMappingURL=trip-controller.js.map