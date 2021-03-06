import * as mongoose from 'mongoose';
import { ObjectID } from 'bson';
import { DAOImpl } from '../persist/dao';
import validator from 'validator';
import { ContactMode } from './shared-interfaces';
const debug = require('debug')('DAO');

delete mongoose.connection.models['User'];

export type LoginType =
| 'password'
| 'facebook' 

export interface IPhone {
    countryCode: string,
    internationalNumber: string,
    nationalNumber: string,
    number: string,
}

//Interface for model
export interface IUser {
    id?: string,
    _id?: ObjectID,
    username?: string,
    email?: string,
    phone?: IPhone,
    password: string,
    facebookId?: string
}

export interface IUserCredentials {
    type: LoginType,
    username?: string,
    email?: string,
    phone?: IPhone,
    password?: string,
    facebookId?: string
}

export interface IForgotPassword {
    type: ContactMode,
    email?: string,
    phone?: IPhone
}

export interface IPayload {
    id: string,
    username: string,
    email?: string,
    phone?: IPhone
}

// Document
export interface UserDocument extends IUser, mongoose.Document {
    id: string,
    _id: ObjectID
}

export class UserDAO extends DAOImpl<IUser, UserDocument> {
    constructor() {
        const UserSchema = new mongoose.Schema({
            username: String,
            email: {
                type: String,
                required: true,
                trim: true,
                unique: true,
                validate: {
                    validator: validator.isEmail
                }
            },
            phone: {
                countryCode: String,
                internationalNumber: String,
                nationalNumber: String,
                number: String
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