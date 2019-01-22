"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require('debug')('service');
// mongoose.Document
class DAOImpl {
    constructor(model) {
        this._model = model;
    }
    create(model) {
        return new Promise((resolve, reject) => {
            let trip = new this._model(model);
            trip.id = trip._id;
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
        });
    }
    ;
    get(id) {
        return new Promise((resolve, reject) => {
            this._model.findOne({ id })
                .lean()
                .exec((err, trip) => {
                if (err) {
                    debug('trip-service - findById - FAILED => Trip with id => ${id} not found');
                    reject(new Error(`Trip with id => ${id} not found`));
                }
                else {
                    debug('trip-service - findById - OK => ' + JSON.stringify(trip));
                    resolve(trip);
                }
            });
        });
    }
    ;
    getAll() {
        return new Promise((resolve, reject) => {
            this._model.find({})
                .lean()
                .exec((err, res) => {
                if (err) {
                    debug('trip-service - findById - FAILED => No trips found');
                    reject(new Error("No trips found"));
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    ;
    update(model) {
        return new Promise((resolve, reject) => {
            let trip = new this._model(model);
            trip.id = trip._id;
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
        });
    }
    ;
    delete(id) {
        return new Promise((resolve, reject) => {
            this._model.deleteOne({ id }, err => {
                if (err) {
                    debug('trip-service - deleteTrip - FAILED => ' + err);
                    reject(err);
                }
                debug('trip-service - deleteTrip - OK');
            });
        });
    }
    ;
    deleteAll() {
        return new Promise((resolve, reject) => {
            this._model.deleteMany({}, err => {
                if (err) {
                    debug('trip-service - deleteAllTrips - FAILED => ' + err);
                    reject(err);
                }
                debug('trip-service - deleteAllTrips - OK');
            });
        });
    }
}
exports.DAOImpl = DAOImpl;
//# sourceMappingURL=dao.js.map