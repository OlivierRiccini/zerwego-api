import * as mongoose from 'mongoose';
import { ObjectID } from 'bson';

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
    startDate: Date,
    endDate: Date,
    adminId: String, 
    // usersIds: [{
    //     type: String
    // }]
});

const Trip = mongoose.model('Trip', TripSchema);
export default Trip;