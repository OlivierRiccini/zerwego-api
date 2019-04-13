import * as mongoose from 'mongoose';
import { ObjectID } from 'bson';
import { DAOImpl } from '../persist/dao';

delete mongoose.connection.models['Trip'];

export interface ITrip {
    id?: string,
    _id?: ObjectID,
    tripName: string,
    destination: string,
    imageUrl: string,
    startDate: Date;
    endDate: Date;
    participants?: IParticipant[];
};

export type ParticipationStatus = 
| 'pending'
| 'request_accepted'
| 'request_rejected'
| 'not_registred'

export interface IParticipant {
    userId?: string,
    info: {
        username: string,
        email?: string,
        phone?: string
    },
    isAdmin?: boolean,
    status: ParticipationStatus
}

export interface TripDocument extends ITrip, mongoose.Document {
    id: string,
    _id: ObjectID
}

export interface IWaitingUser {
    username: string,
    email: string
}

export class TripDAO extends DAOImpl<ITrip, TripDocument> {
    constructor() {

        const ParticipantSchema = new mongoose.Schema({
            userId: String,
            info: {
                username: String,
                email: String
            },
            isAdmin: Boolean,
            status: String 
        }, { _id: false });

        const TripSchema = new mongoose.Schema({
            id: String,
            tripName: String,
            destination: String,
            imageUrl: String,
            startDate: { type: Date },
            endDate: { type: Date },
            participants: [ParticipantSchema]
        });
        super('Trip', TripSchema);
    }
}