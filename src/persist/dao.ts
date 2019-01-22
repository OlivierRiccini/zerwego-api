import { MongooseDocument, Model } from "mongoose";
const debug = require('debug')('service');

export interface DAO<T> {
    create(model:T):Promise<T>;
    get(id:number|string): Promise<T|any>;
    getAll():Promise<[T]>;
    update(model:any):Promise<T>;
    delete(id:number|string):Promise<any>;
    deleteAll():Promise<any>;
}

// mongoose.Document
export abstract class DAOImpl<T> implements DAO<T> {
    _model: any;

    constructor(model) {
        this._model = model;
    }

    create(model:T):Promise<T> {
        return new Promise((resolve, reject) => {
            let trip = new this._model(model);
            trip.id = trip._id
            trip.save((err, res) => {
                if (err) {
                    debug('trip-service - createTrip - FAILED => ' + err);
                    reject(err);
                }    
                let trip = res.toObject();
                trip.startDate = new Date(trip.startDate);
                trip.endDate = new Date(trip.endDate);
                debug('trip-service - createTrip - OK => ' + JSON.stringify(trip));
                resolve(trip);
            });
        })
    };

    get(id:number|string): Promise<T|any> {
        return new Promise((resolve, reject) => {
            this._model.findOne({ id })
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
    };

    getAll():Promise<[T]> {
        return new Promise((resolve, reject) => {
            this._model.find({})
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
    };

    update(model:any):Promise<T> {
        return new Promise((resolve, reject) => {
            let trip = new this._model(model);
            trip.id = trip._id
            trip.save((err, res) => {
                if (err) {
                    debug('trip-service - createTrip - FAILED => ' + err);
                    reject(err);
                }    
                let trip = res.toObject();
                trip.startDate = new Date(trip.startDate);
                trip.endDate = new Date(trip.endDate);
                debug('trip-service - createTrip - OK => ' + JSON.stringify(trip));
                resolve(trip);
            });
        })
    };

    delete(id:number|string):Promise<any> {
        return new Promise((resolve, reject) => {
            this._model.deleteOne({ id }, err => {
                if (err) {
                    debug('trip-service - deleteTrip - FAILED => ' + err);
                    reject(err);
                }
                debug('trip-service - deleteTrip - OK');    
            });
        })
    };

    deleteAll() {
        return new Promise((resolve, reject) => {
            this._model.deleteMany({}, err => {
                if (err) {
                    debug('trip-service - deleteAllTrips - FAILED => ' + err);
                    reject(err);
                }
                debug('trip-service - deleteAllTrips - OK');
            });
        })
    }
}