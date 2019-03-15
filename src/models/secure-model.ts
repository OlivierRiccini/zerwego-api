import * as mongoose from 'mongoose';
import { ObjectID } from 'bson';
import { DAOImpl } from '../persist/dao';

delete mongoose.connection.models['Secure'];

//Interface for model
export interface ISecure {
    id?: string,
    _id?: ObjectID,
    refreshToken: string,
    _accessToken: string
    // _userId: string,
};

// Document
export interface UserDocument extends ISecure, mongoose.Document {
    id: string,
    _id: ObjectID
}

export class SecureDAO extends DAOImpl<ISecure, UserDocument> {
    constructor() {
        const SecureSchema = new mongoose.Schema({
            id: String,
            refreshToken: String,
            _accessToken: String
            // _userId: String
        });
       
        super('Secure', SecureSchema);
    }
}