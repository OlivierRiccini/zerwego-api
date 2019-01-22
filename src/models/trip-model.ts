import * as mongoose from 'mongoose';
import { ObjectID } from 'bson';
import { DAOImpl } from '../persist/dao';
import { MongooseDocument } from 'mongoose';

delete mongoose.connection.models['Trip'];

export interface ITrip extends mongoose.Document {
    id?: string,
    _id: ObjectID,
    tripName: string,
    destination: string,
    imageUrl: string,
    startDate: Date;
    endDate: Date;
    adminId: String, 
    usersIds?: String[];
};

export const TripSchema = new mongoose.Schema({
    id: String,
    tripName: String,
    destination: String,
    imageUrl: String,
    startDate: { type: Date },
    endDate: { type: Date },
    adminId: String, 
    // usersIds: [{
    //     type: String
    // }]
});

const Trip = mongoose.model('Trip', TripSchema);
export default Trip;

export class TripModel extends DAOImpl<ITrip> {
    // model = Trip;
    constructor() {
        super(Trip);
    }
}