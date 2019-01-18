import mongoose = require('mongoose');
import { Service } from "typedi";
import Trip from '../models/trip-model';

@Service()
export class TripService {
    constructor() {
    }
    
    fetchAll(){
        return new Promise((resolve, reject) => {
            Trip.find({})
            .lean()
            .exec((err: any, res: any) => {
                if (err) {
                    reject(new Error("No trips found"));
                } else {
                    resolve(res);
                    console.log(res);
                }
            })
        });
    }

    public createTrip (req: any) {          
        return new Promise((resolve, reject) => {
            let trip = new Trip(req);
            trip.save((err, trip) => {
                if (err) {
                    reject(err);
                }    
                console.log('Successfully created!');
                resolve(trip);
            });
        })
    }
}