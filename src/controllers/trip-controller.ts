import { Request, Response } from 'express'
import Trip from '../models/trip-model'

export let allTrips = (req: Request, res: Response) => {
  let trips = Trip.find((err: any, books: any) => {
    if (err) {
      res.send("Error!");
    } else {
      res.send(books);
    }
  })
}

export let getTrip = (req: Request, res: Response) => {
    let trip = Trip.findById(req.params.id, (err: any, book: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(book)
      }
    })
  }

  export let deleteTrip = (req: Request, res: Response) => {
    let trip = Trip.deleteOne({ _id: req.params.id }, (err: any) => {
      if (err) {
        res.send(err)
      } else {
        res.send("Succesfully Deleted Trip");
      }
    })
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
    var trip = new Trip(req.body);
    console.log(trip);
    trip.save((err: any) => {
      if (err) {
        res.status(400).send(err)
      } else {
        res.send(trip)
      }
    })
  }