"use strict";
// import { Request, Response } from 'express'
// import Trip from '../models/trip-model'
// import { Mongoose } from 'mongoose';
// var ObjectID = require("bson-objectid");
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
// export let allTrips = (req: Request, res: Response) => {
//   let trips = Trip.find((err: any, trips: any) => {
//     if (err) {
//       res.send("Error!");
//     } else {
//       res.send(trips);
//     }
//   })
// }
// export let getTrip = (req: Request, res: Response) => {
//     let foundTrip = Trip.findById(req.params.id, (err: any, trip: any) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send(trip)
//       }
//     })
//   }
//   export let deleteTrip = (req: Request, res: Response) => {
//     let trip = Trip.deleteOne({ _id: req.params.id })
//       .then(res => res.send("Succesfully Deleted Trip"))
//       .catch(err => res.send(err));
//     //  => {
//       // if (err) {
//       //   res.send(err)
//       // } else {
//       //   res.send("Succesfully Deleted Trip");
//       // }
//     // })
//   }
//   export let updateTrip = (req: Request, res: Response) => {
//     console.log(req.body);
//     let trip = Trip.findByIdAndUpdate(req.params.id, req.body, (err: any, book: any) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send("Succesfully updated book!");
//       }
//     });
//   }
//   export let addTrip = (req: Request, res: Response) => {
//     let trip = new Trip(req.body);
//     trip._id = ObjectID();
//     console.log(trip);
//     trip.save((err: any) => {
//       if (err) {
//         res.status(400).send(err)
//       } else {
//         res.send(trip)
//       }
//     })
//   }
// import {
//   Controller, Get, Render, Post, 
//   Authenticated, Required, BodyParams,
//   Delete,
//   Inject
// } from "@tsed/common";
// import { ITrip, Trip } from "../models/trip-model";
// import { MongooseModel } from "@tsed/mongoose";
// // import { Mongoose } from 'mongoose';
// // export interface Calendar{
// //   id: string;
// //   name: string;
// // }
// @Controller("/trips")
// export class CalendarCtrl {
//   constructor(@Inject(Trip) private trip: MongooseModel<Trip>) {
//     console.log(Trip) // Mongoose.model class
//   }
//   // async find(query: any) {
//   //   const list = await this.trip.find(query).exec();
//   //   console.log(list);
//   //   return list;
//   // }
//   // @Get("/")
//   // // @Render("calendars/index")
//   // async renderCalendars(): Promise<JSON> {
//   //   let trips = await this.trip.find();
//   //   return trips;
//   // }
//   // @Post("/")
//   // @Authenticated()
//   // async post(
//   //   @Required() @BodyParams("calendar") calendar: Calendar
//   // ): Promise<Calendar> {
//   //   calendar.id = "1";
//   //   return Promise.resolve(calendar);
//   // }
//   // @Delete("/")
//   // @Authenticated()
//   // async deleteItem(
//   //   @BodyParams("calendar.id") @Required() id: string 
//   // ): Promise<Calendar> {
//   //   return {id, name: "calendar"};
//   // }
// }
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
};
__decorate([
    routing_controllers_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TripController.prototype, "getAll", null);
TripController = __decorate([
    routing_controllers_1.JsonController('/trips'),
    __metadata("design:paramtypes", [trip_Service_1.TripService])
], TripController);
exports.TripController = TripController;
//# sourceMappingURL=trip-controller.js.map