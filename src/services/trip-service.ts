import mongoose = require('mongoose');
import { Service } from "typedi";
import Trip, { ITrip } from '../models/trip-model';
import { ObjectID } from 'bson';
import { Model } from 'mongoose';
import { resolve } from 'url';
import { rejects } from 'assert';

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
                    console.log('//////////// FETCH ALL ////////////');
                    console.log(res);
                }
            })
        });
    }

    public createTrip (req: any) {          
        return new Promise((resolve, reject) => {
            let trip = new Trip(req);
            trip.id = trip._id
            trip.save((err, trip) => {
                if (err) {
                    reject(err);
                }    
                console.log('Successfully created!');
                resolve(trip);
            });
        })
    }

    public deleteTrip (id: any) {          
        return new Promise((resolve, reject) => {
            Trip.deleteOne({ id }, err => {
                if (err) {
                    reject(err);
                }    
                console.log('Successfully deleted!');
            });
        })
    }

    public deleteAllTrips() {
        return new Promise((resolve, reject) => {
            Trip.deleteMany({}, err => {
                if (err) {
                    reject(err);
                }
                console.log('All documents from Trip collection have been deleted!');
            });
        })
    }
}