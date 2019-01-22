const debug = require('debug')('service');
import mongoose = require('mongoose');
import { Service } from "typedi";
import Trip, { ITrip, TripModel } from '../models/trip-model';

@Service()
export class TripService {
    constructor(private tripModel: TripModel) {
    }
    
    public fetchAll(){
        return new Promise((resolve, reject) => {
            Trip.find({})
            .lean()
            .exec((err: any, res: any) => {
                if (err) {
                    debug('trip-service - findById - FAILED => No trips found');
                    reject(new Error("No trips found"));
                } else {
                    resolve(res);
                }
            })
        });
    }

    public findById(id: string) {
        return new Promise((resolve, reject) => {
            Trip.findOne({ id })
            .lean()
            .exec((err: any, trip: any) => {
                if (err) {
                    debug('trip-service - findById - FAILED => Trip with id => ${id} not found');
                    reject(new Error(`Trip with id => ${id} not found`));
                } else {
                    debug('trip-service - findById - OK => ' + JSON.stringify(trip));
                    resolve(trip);
                }
            })
        })
    }

    public createTrip(req: any) {          
        return this.tripModel.create(req);
    }

    public deleteTrip(id: any) {          
        return new Promise((resolve, reject) => {
            Trip.deleteOne({ id }, err => {
                if (err) {
                    debug('trip-service - deleteTrip - FAILED => ' + err);
                    reject(err);
                }
                debug('trip-service - deleteTrip - OK');    
            });
        })
    }

    public deleteAllTrips() {
        return new Promise((resolve, reject) => {
            Trip.deleteMany({}, err => {
                if (err) {
                    debug('trip-service - deleteAllTrips - FAILED => ' + err);
                    reject(err);
                }
                debug('trip-service - deleteAllTrips - OK');
            });
        })
    }
}