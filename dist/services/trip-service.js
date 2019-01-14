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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const trip_model_1 = require("../models/trip-model");
let TripService = class TripService {
    constructor() {
    }
    fetchAll() {
        return new Promise((resolve, reject) => {
            trip_model_1.default.find({})
                .lean()
                .exec((err, res) => {
                if (err) {
                    reject(new Error("No trips found"));
                }
                else {
                    resolve(res);
                    console.log(res);
                }
            });
        });
    }
};
TripService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], TripService);
exports.TripService = TripService;
//# sourceMappingURL=trip-Service.js.map