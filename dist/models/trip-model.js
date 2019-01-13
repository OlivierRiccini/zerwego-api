"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
;
exports.TripSchema = new mongoose.Schema({
    id: String,
    tripName: String,
    destination: String,
    imageUrl: String,
    startDate: Date,
    endDate: Date,
    adminId: String,
    usersIds: [{
            type: String
        }]
});
const Trip = mongoose.model('Trip', exports.TripSchema);
exports.default = Trip;
//# sourceMappingURL=trip-model.js.map