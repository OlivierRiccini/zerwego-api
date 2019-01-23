"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dao_1 = require("../persist/dao");
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
class TripDAO extends dao_1.DAOImpl {
    // model = Trip;
    constructor() {
        super(Trip);
    }
}
exports.TripDAO = TripDAO;
//# sourceMappingURL=trip-model.js.map