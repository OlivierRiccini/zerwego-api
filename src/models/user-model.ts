import * as mongoose from 'mongoose';
import { ObjectID, ObjectId } from 'bson';
import { DAOImpl } from '../persist/dao';
import validator from 'validator';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { HttpError } from 'routing-controllers';
const debug = require('debug')('DAO');

delete mongoose.connection.models['User'];

//Interface for model
export interface IUser {
    id?: string,
    _id?: ObjectID,
    name?: string,
    email?: string,
    password?: string,
    tokens?: [{
        access: string,
        token: string
    }?]
};

export interface IUserCredentials {
    email: string,
    password: string
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
            // tokens: [{
            //     access: {
            //         type: String,
            //         required: true
            //     },
            //     token: {
            //         type: String,
            //         required: true
            //     }
            // }]
        });
       
        super('User', UserSchema);
    }

    public async findByToken(token): Promise<IUser> {
        var decoded: any;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (e) {
            throw new HttpError(400, 'Invalid token BLA');
        }
        const users = await this.find({
            find: {
                '_id': decoded._id,
                'tokens.token': token,
                'tokens.access': 'auth'
            }
        });
        return users[0];
    };

    public removeToken(id: string): Promise<any> {
        return new Promise<any>(
            (resolve: Function, reject: Function) => {
                this.model.findById(id).exec(
                    (err, user) => {
                        if (err) { reject(err) };
                        if (!user) { reject('Removing token: User was not found') };
                        user.tokens = [];
                        user.save(
                            (err, user) => {
                                if (err) {
                                    debug('removeToken - FAILED => ' + JSON.stringify(err));
                                    reject(err);
                                };
                                debug('removeToken - OK');
                                resolve(user.toObject()) 
                            }
                        )
                    }
                );
            }
        );
    };
}