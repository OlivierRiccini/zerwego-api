import * as mongoose from 'mongoose';
import { ObjectID, ObjectId } from 'bson';
import { DAOImpl } from '../persist/dao';
import validator from 'validator';
// const {SHA256} = require('crypto-js');
// import {SHA256} as crypto from 'crypto-js';
import {SHA256} from "crypto-js";
// const hash = SHA256()
const data = { 
    id: 4
};

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

if (resultHash === token.hash) {
    console.log('Data was not changed');
} else {
    console.log('Data was changed do not trust');
}



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
            tokens: [{
                access: {
                    type: String,
                    required: true
                },
                token: {
                    type: String,
                    required: true
                }
            }]
        });
        super('User', UserSchema);
    }
}