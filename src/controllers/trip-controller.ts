// import { Request, Response } from 'express'
// import Trip from '../models/trip-model'
// import { Mongoose } from 'mongoose';
// var ObjectID = require("bson-objectid");

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
import {JsonController, Param, Body, Get, Post, Put, Delete, Req, Res} from "routing-controllers";
import { TripService } from "../services/trip-Service";
import { ITrip } from "../models/trip-model";

@JsonController('/trips')
export class TripController {
  constructor(private tripService: TripService) {    
    this.tripService = new TripService();
  }
  
 
  @Get()
  async getAll() { 
    let trips = await this.tripService.fetchAll();
    //  console.log(trips);
     return trips;
  }
 
}