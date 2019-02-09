import * as mongoose from 'mongoose';
import { ObjectID, ObjectId } from 'bson';
import { DAOImpl } from '../persist/dao';
import validator from 'validator';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

// const data = {
//     id: 10
// };

// const token = jwt.sign(data, '123abc');
// console.log(token);
// const decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

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
}

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

    public async findByToken(token) {
        return new Promise((resolve, reject) => {
            var decoded;
            try {
                decoded = jwt.verify(token, 'abc123');
            } catch (e) {
                return reject();
            }
            this.find({
                find: {
                    '_id': decoded._id,
                    'tokens.token': token,
                    'tokens.access': 'auth'
                  }
            })
            .then(users => resolve(users[0]))
            .catch(err => reject(err));
        })
    
      };

}