const debug = require('debug')('service');
import { Service } from "typedi";
import { UserDAO, IUser, IUserCredentials } from '../models/user-model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { ObjectID } from "bson";
import { HttpError } from "routing-controllers";

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
    secret = process.env.JWT_SECRET;

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

    public async generateAuthToken(user): Promise<any> {
        // let token: string;
        // jwt.sign({user: user}, this.secret, (err, token) => {
        //     if(err)  {
        //         throw new HttpError(404, 'Something went wrong while generating token');
        //     } else {
        //         Promise.resolve(token);
        //     }
        // });
        // console.log(token);
        // return token;
        // const access = 'auth';
        return await jwt.sign({user}, this.secret, { expiresIn: '10s' }).toString();
        // user.tokens.push({access, token});
    };

    
    public async register(req: any): Promise<IUserResponse> {         
        try {
            let user = req;
            // this.enrichUser(user);
            // await this.generateAuthToken(user);
            user.password = await this.hashPassword(user);
            user = await this.userDAO.create(req);
            const token = await this.generateAuthToken(user);
            return this.buildUserResponse(user, token);
        } catch (err) {
            console.log('Smothing went wrong while creating new user');
        }
    };

    public async login(credentials: IUserCredentials): Promise<IUserResponse> {
        try {
            let users = await this.userDAO.find({find:{email: credentials.email}});
            let user = users[0];
            await this.comparePassword(credentials.password, user.password);
            const token = await this.generateAuthToken(user);
            // await this.userDAO.update(user, user.id);
            return this.buildUserResponse(user, token);
        } catch (err) {
            throw new Error('Err= ' + err);
        }
    };

    public async logout(token: string): Promise<void> {
        const user: IUser = await this.userDAO.findByToken(token);
        await this.userDAO.removeToken(user.id);
    };

    public buildUserResponse(user: IUser, token: string): IUserResponse {
        return {
            propToSend: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token
        }
    };

    private enrichUser(user: IUser): void {
        user._id = new ObjectID;
        user.tokens = [];
    };

}