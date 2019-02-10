const debug = require('debug')('service');
import { Service } from "typedi";
import { UserDAO, IUser, IUserCredentials } from '../models/user-model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { ObjectID } from "bson";

export interface IUserResponse {
    propToSend: {
        id: string,
        name: string,
        email: string
    },
    token: string
};

@Service()
export class UserService {
    secret = 'abc123';

    constructor(private userDAO: UserDAO) {
    };

    public async hashPassword(user: IUser): Promise<string> {
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
    };

    public async comparePassword(credentialPassword: string, userPassword: string): Promise<void> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(credentialPassword, userPassword, (err, res) => {
                if (res) {
                    resolve();
                } else {
                    reject("Wrong password");
                }
            });
        });
    };

    public async generateAuthToken(user): Promise<void> {
        const access = 'auth';
        const token = jwt.sign({_id: user._id.toHexString(), access}, this.secret).toString();
        user.tokens.push({access, token});
    };

    // public async findUserByToken(token: string): Promise<IUser> {
    //     let decoded;
    //     try {
    //         decoded = jwt.verify(token, 'abc123');
    //     } catch (err) {
    //         console.log('err');
    //     };

    //     const results = await this.userDAO.find({
    //         find: {
    //             'id': decoded._id,
    //             'tokens.token': token,
    //             'tokens.access': 'auth'
    //         }
    //     });
    //     if (results.length < 1) {
    //         Promise.reject('User was not found');
    //     };
    //     return results[0];
    // };
    
    public async signUp(req: any): Promise<IUserResponse> {         
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
    };

    public async signIn(credentials: IUserCredentials): Promise<IUserResponse> {
        try {
            let users = await this.userDAO.find({find:{email: credentials.email}});
            let user = users[0];
            await this.comparePassword(credentials.password, user.password);
            await this.generateAuthToken(user);
            await this.userDAO.update(user, user.id);
            return this.buildUserResponse(user);
        } catch (err) {
            console.log('Err= ' + err);
            throw new Error('Err= ' + err);
        }
    };

    public async signOut(token: string): Promise<void> {
        const user: IUser = await this.userDAO.findByToken(token);
        await this.userDAO.removeToken(user.id);
    };

    public buildUserResponse(user: IUser): IUserResponse {
        return {
            propToSend: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token: user.tokens[0].token
        }
    };

    private enrichUser(user: IUser): void {
        user._id = new ObjectID;
        user.tokens = [];
    };

}