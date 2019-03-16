import * as mongoose from 'mongoose';
import { ObjectID } from 'bson';
import { DAOImpl } from '../persist/dao';

delete mongoose.connection.models['Trip'];

//Interface for model
export interface ITrip {
    id?: string,
    _id?: ObjectID,
    tripName: string,
    destination: string,
    imageUrl: string,
    startDate: Date;
    endDate: Date;
    adminId: String, 
    userIds?: String[];
};

// Document
export interface TripDocument extends ITrip, mongoose.Document {
    id: string,
    _id: ObjectID
}

export class TripDAO extends DAOImpl<ITrip, TripDocument> {
    constructor() {
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
            }]
        });
        super('Trip', TripSchema);
    }
}