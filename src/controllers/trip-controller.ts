import { Request, Response } from 'express'
import Trip from '../models/trip-model'
// import { Mongoose } from 'mongoose';
var ObjectID = require("bson-objectid");

export let allTrips = (req: Request, res: Response) => {
  let trips = Trip.find((err: any, trips: any) => {
    if (err) {
      res.send("Error!");
    } else {
      res.send(trips);
    }
  })
}

export let getTrip = (req: Request, res: Response) => {
    let foundTrip = Trip.findById(req.params.id, (err: any, trip: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(trip)
      }
    })
  }

  export let deleteTrip = (req: Request, res: Response) => {
    let trip = Trip.deleteOne({ _id: req.params.id })
      .then(res => res.send("Succesfully Deleted Trip"))
      .catch(err => res.send(err));
    //  => {
      // if (err) {
      //   res.send(err)
      // } else {
      //   res.send("Succesfully Deleted Trip");
      // }
    // })
  }

  export let updateTrip = (req: Request, res: Response) => {
    console.log(req.body);
    let trip = Trip.findByIdAndUpdate(req.params.id, req.body, (err: any, book: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Succesfully updated book!");
      }
    });
  
  }

  export let addTrip = (req: Request, res: Response) => {
    let trip = new Trip(req.body);
    trip._id = ObjectID();
    console.log(trip);
    trip.save((err: any) => {
      if (err) {
        res.status(400).send(err)
      } else {
        res.send(trip)
      }
    })
  }