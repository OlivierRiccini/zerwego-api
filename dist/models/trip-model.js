"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const uri = 'mongodb://127.0.0.1:27017/zerwego-api';
mongoose.connect(uri, (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Succesfully Connected!");
    }
});
;
exports.TripSchema = new mongoose.Schema({
    id: String,
    tripName: String,
    destination: String,
    imageUrl: String,
    startDate: Date,
    endDate: Date,
    participants: []
});
const Trip = mongoose.model('Trip', exports.TripSchema);
exports.default = Trip;
//# sourceMappingURL=trip-model.js.map