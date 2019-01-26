"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const debug = require('debug')('DAO');
;
;
// mongoose.Document
// CHECK https://github.com/Eslem/TSGeneric-DAO-API/blob/master/src/persistence/impl/mongoose/GenericDAOImplMongoose.ts
class DAOImpl {
    constructor(_modelName, _modelSchema, connection) {
        this._modelName = _modelName;
        this._modelSchema = _modelSchema;
        this.connection = connection;
        if (!this.constructor['created']) {
            if (connection) {
                this.constructor['_model'] = connection.model(_modelName, _modelSchema);
            }
            else {
                this.constructor['_model'] = mongoose.model(_modelName, _modelSchema);
            }
            this.constructor['created'] = true;
        }
        this.model = this.constructor['_model'];
    }
    create(model) {
        return new Promise((resolve, reject) => {
            let trip = new this.model(model);
            trip.id = trip._id;
            trip.save((err, res) => {
                if (err) {
                    debug('createTrip - FAILED => ' + err);
                    reject(err);
                }
                let trip = res.toObject();
                trip.startDate = new Date(trip.startDate);
                trip.endDate = new Date(trip.endDate);
                debug('createTrip - OK => ' + JSON.stringify(trip));
                resolve(trip);
            });
        });
    }
    ;
    get(id) {
        return new Promise((resolve, reject) => {
            this.model.findOne({ id })
                .lean()
                .exec((err, trip) => {
                if (err) {
                    debug('get - FAILED => Trip with id => ${id} not found');
                    reject(new Error(`Trip with id => ${id} not found`));
                }
                else {
                    debug('get - OK => ' + JSON.stringify(trip));
                    resolve(trip);
                }
            });
        });
    }
    ;
    getAll() {
        return new Promise((resolve, reject) => {
            this.model.find({})
                .lean()
                .exec((err, res) => {
                if (err) {
                    debug('findById - FAILED => No trips found');
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
            let trip = new this.model(model);
            trip.id = trip._id;
            trip.save((err, res) => {
                if (err) {
                    debug('createTrip - FAILED => ' + err);
                    reject(err);
                }
                let trip = res.toObject();
                trip.startDate = new Date(trip.startDate);
                trip.endDate = new Date(trip.endDate);
                debug('createTrip - OK => ' + JSON.stringify(trip));
                resolve(trip);
            });
        });
    }
    ;
    delete(id) {
        return new Promise((resolve, reject) => {
            this.model.deleteOne({ id }, err => {
                if (err) {
                    debug('deleteTrip - FAILED => ' + JSON.stringify(err));
                    reject(err);
                }
                debug('deleteTrip - OK');
                resolve({ message: 'Deleted' });
            });
        });
    }
    ;
    deleteAll() {
        return new Promise((resolve, reject) => {
            this.model.deleteMany({}, err => {
                if (err) {
                    debug('deleteAllTrips - FAILED => ' + JSON.stringify(err));
                    reject(err);
                }
                debug('deleteAllTrips - OK');
                resolve({ message: 'Deleted' });
            });
        });
    }
    find(findOptions) {
        console.log(findOptions);
        return new Promise((resolve, reject) => {
            this.model.find(findOptions.find)
                .lean()
                .exec((err, res) => {
                if (err) {
                    debug('find - FAILED => No trips found');
                    reject(new Error("No trips found"));
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    findAndRemove(deleteOptions) {
        return new Promise((resolve, reject) => {
            this.model.deleteOne(deleteOptions, err => {
                if (err) {
                    debug('findAndRemove - FAILED => ' + JSON.stringify(err));
                    reject(err);
                }
                debug('findAndRemove - OK', JSON.stringify('rr'));
                resolve({ message: 'Deleted' });
            });
        });
    }
    count(findOptions) {
        return new Promise((resolve, reject) => {
            this.model.countDocuments(findOptions)
                .lean()
                .exec((err, res) => {
                if (err) {
                    debug('count - FAILED => No trips found');
                    reject(new Error("No trips found"));
                }
                else {
                    resolve(res);
                }
            });
        });
    }
}
DAOImpl.created = false;
exports.DAOImpl = DAOImpl;
//# sourceMappingURL=dao.js.map