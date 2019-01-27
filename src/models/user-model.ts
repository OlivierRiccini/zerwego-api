import * as mongoose from 'mongoose';
import { ObjectID, ObjectId } from 'bson';
import { DAOImpl } from '../persist/dao';

delete mongoose.connection.models['Trip'];

//Interface for model
export interface IUser {
    id?: string,
    _id?: ObjectID,
    name?: string,
    email?: string,
    password?: string
};

// Document
export interface UserDocument extends IUser, mongoose.Document {
    id: string,
    _id: ObjectID
}


export class UserDAO extends DAOImpl<IUser, UserDocument> {
    constructor() {
        const UserSchema = new mongoose.Schema({
            id: String,
            name: String,
            email: String,
            password: String
        });
        super('User', UserSchema);
    }
}