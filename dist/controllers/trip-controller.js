"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trip_model_1 = require("../models/trip-model");
// import { Mongoose } from 'mongoose';
var ObjectID = require("bson-objectid");
exports.allTrips = (req, res) => {
    let trips = trip_model_1.default.find((err, trips) => {
        if (err) {
            res.send("Error!");
        }
        else {
            res.send(trips);
        }
    });
};
exports.getTrip = (req, res) => {
    let foundTrip = trip_model_1.default.findById(req.params.id, (err, trip) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send(trip);
        }
    });
};
exports.deleteTrip = (req, res) => {
    let trip = trip_model_1.default.deleteOne({ _id: req.params.id })
        .then(res => res.send("Succesfully Deleted Trip"))
        .catch(err => res.send(err));
    //  => {
    // if (err) {
    //   res.send(err)
    // } else {
    //   res.send("Succesfully Deleted Trip");
    // }
    // })
};
exports.updateTrip = (req, res) => {
    console.log(req.body);
    let trip = trip_model_1.default.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Succesfully updated book!");
        }
    });
};
exports.addTrip = (req, res) => {
    let trip = new trip_model_1.default(req.body);
    trip._id = ObjectID();
    console.log(trip);
    trip.save((err) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.send(trip);
        }
    });
};
//# sourceMappingURL=trip-controller.js.map