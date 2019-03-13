import { Service } from "typedi";
import { UserDAO, IUser, IUserCredentials } from '../models/user-model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

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
    secret = process.env.ACCESS_TOKEN_SECRET;

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
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        return await jwt.sign({payload}, this.secret, { expiresIn: '10s' }).toString();
    };

    
    public async register(req: any): Promise<string> {         
        try {
            let user = req;
            user.password = await this.hashPassword(user);
            user = await this.userDAO.create(req);
            const token = await this.generateAuthToken(user);
            return token;
        } catch (err) {
            console.log('Smothing went wrong while creating new user');
        }
    };

    public async login(credentials: IUserCredentials): Promise<string> {
        try {
            let users = await this.userDAO.find({find:{email: credentials.email}});
            let user = users[0];
            await this.comparePassword(credentials.password, user.password);
            const token = await this.generateAuthToken(user);
            return token;
        } catch (err) {
            throw new Error('Err= ' + err);
        }
    };
}