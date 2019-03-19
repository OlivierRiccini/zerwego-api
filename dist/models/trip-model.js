"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dao_1 = require("../persist/dao");
delete mongoose.connection.models['Trip'];
;
class TripDAO extends dao_1.DAOImpl {
    constructor() {
        const ParticipantSchema = new mongoose.Schema({
            userId: String,
            info: {
                email: String,
                name: String
            },
            status: String
        }, { _id: false });
        const TripSchema = new mongoose.Schema({
            id: String,
            tripName: String,
            destination: String,
            imageUrl: String,
            startDate: { type: Date },
            endDate: { type: Date },
            adminId: String,
            userIds: [{
                    type: String
                }],
            participants: [ParticipantSchema]
        });
        super('Trip', TripSchema);
    }
}
exports.TripDAO = TripDAO;
//# sourceMappingURL=trip-model.js.map