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
};

// Document
export interface SecureDocument extends ISecure, mongoose.Document {
    id: string,
    _id: ObjectID
}


export class SecureDAO extends DAOImpl<ISecure, SecureDocument> {
    constructor() {
        const SecureSchema = new mongoose.Schema({
            refreshToken: String,
            _accessToken: String
        });
       
        super('Secure', SecureSchema);
    }
}
