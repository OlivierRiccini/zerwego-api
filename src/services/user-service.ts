const debug = require('debug')('service');
import { Service, Inject } from "typedi";
import { UserDAO, IUser } from '../models/user-model';
import * as jwt from 'jsonwebtoken';
// const _ = require('lodash');
// import * as _ from 'lodash';
// const bcrypt = require('bcryptjs');
import * as bcrypt from 'bcryptjs';
import { ObjectID } from "bson";
import { access } from "fs";

export interface IUserResponse {
    propToSend: {
        id: string,
        email: string
    },
    token: string
};

@Service()
export class UserService {
    secret = 'abc123';

    constructor(private userDAO: UserDAO) {
    }

    public async hashPassword(user): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) {
                        reject(new Error("Something went wrong while hashing password"));
                    } else {
                        resolve(hash);
                    };
                })
            });
        });
    }

    public async generateAuthToken(user): Promise<void> {
        const access = 'auth';
        const token = jwt.sign({_id: user._id.toHexString(), access}, this.secret).toString();
        user.tokens.push({access, token});
    }
    
    public async createUser(req: any): Promise<IUserResponse> {         
        try {
            let user = req;
            this.enrichUser(user);
            await this.generateAuthToken(user);
            user.password = await this.hashPassword(user);
            user = await this.userDAO.create(req);
            return this.buildUserResponse(user);
        } catch (err) {
            console.log('Smothing went wrong while creating new user');
        }
    }

    public buildUserResponse(user: IUser): IUserResponse {
        return {
            propToSend: {
                id: user.id,
                email: user.email,
            },
            token: user.tokens[0].token
        }
    }

    private enrichUser(user: IUser): void {
        user._id = new ObjectID;
        user.tokens = [];
    }

}