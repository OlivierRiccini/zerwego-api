import { Service } from "typedi";
import { IUser} from '../models/user-model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { CONSTANTS } from "../persist/constants";
import { HttpError } from "routing-controllers";
import { SecureDAO, ISecure } from "../models/secure-model";

@Service()
export class SecureService {

    constructor(private secureDAO: SecureDAO) {};

    public async generateAuthToken(user: IUser): Promise<any> {
        try {
            const refreshToken = await this.findRefreshTokenByUserId(user.id);
            if (!refreshToken) {
                await this.generateRefreshToken(user.id);
            }
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
            };
            const access_token = await jwt.sign({payload}, CONSTANTS.JWT_SECRET, { expiresIn: '60s' }).toString();
            return access_token;
        } catch (err) {
            throw new HttpError(401, err);
        }
    };

    async generateRefreshToken(userId: string): Promise<void> {
        const refresh_token = await jwt.sign({_userId: userId}, CONSTANTS.JWT_SECRET, { expiresIn: '7d' }).toString();
        await this.secureDAO.create({refresh_token, _userId: userId});
    }

    async refreshToken(expiredToken: string) {
        try {
            const decodedExpiredToken = jwt.verify(expiredToken, CONSTANTS.JWT_SECRET, null);
            const userId = decodedExpiredToken['payload'].id;
            const refreshToken = await this.findRefreshTokenByUserId(userId);
            if (!refreshToken) {
                throw new Error('No refresh token was found for this token');
            }
            if (this.tokenIsExpired(refreshToken)) {
                await this.secureDAO.delete(refreshToken.id);
                throw new Error('Refresh token is exipred, user has to login');
            }
            const user = decodedExpiredToken['payload'];
            const newToken = await this.generateAuthToken(user);
            return newToken;
        } catch (err) {
            throw new HttpError(401, err);
        }
    }

    tokenIsExpired(token): boolean {
        const decodedToken = jwt.verify(token, CONSTANTS.JWT_SECRET, null);
        const dateNow = new Date();
        return decodedToken['exp'] < dateNow.getTime()/1000;
    }

    async findRefreshTokenByUserId(UserId: string) {
        const tokens = await this.secureDAO.find({find:{_userId: UserId}});
        return tokens.length <= 0 ? null : tokens[0];
    }

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
}