import * as mongoose from 'mongoose';
import { ObjectID } from 'bson';
import { DAOImpl } from '../persist/dao';
import validator from 'validator';
const debug = require('debug')('DAO');

delete mongoose.connection.models['User'];

export type LoginType =
| 'password'
| 'facebook' 

//Interface for model
export interface IUser {
    id?: string,
    _id?: ObjectID,
    name?: string,
    email?: string,
    password: string,
    facebookId?: string
};

export interface IUserCredentials {
    name?: string,
    type: LoginType,
    email: string,
    password?: string,
    facebookId?: string
};

// Document
export interface UserDocument extends IUser, mongoose.Document {
    id: string,
    _id: ObjectID
}

export class UserDAO extends DAOImpl<IUser, UserDocument> {
    constructor() {
        const UserSchema = new mongoose.Schema({
            _id: String,
            name: String,
            email: {
                type: String,
                required: true,
                trim: true,
                unique: true,
                validate: {
                    validator: validator.isEmail,
                    message: '{VALUE} is not a valid email'
                }
            },
            password: {
                type: String,
                require: true,
                minlength: 6
            },
            facebookId: String
        });
       
        super('User', UserSchema);
    }
}