"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
delete mongoose.connection.models['Trip'];
;
exports.TripSchema = new mongoose.Schema({
    id: String,
    tripName: String,
    destination: String,
    imageUrl: String,
    startDate: { type: Date },
    endDate: { type: Date },
    adminId: String,
});
const Trip = mongoose.model('Trip', exports.TripSchema);
exports.default = Trip;
//# sourceMappingURL=trip-model.js.map