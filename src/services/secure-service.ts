import { Service, Inject } from "typedi";
import { IUser, UserDAO, IPayload} from '../models/user-model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { CONSTANTS } from "../persist/constants";
import { HttpError } from "routing-controllers";
import { SecureDAO, ISecure } from "../models/secure-model";

export interface ITokens { accessToken: string, refreshToken: string };

@Service()
export class SecureService {
    @Inject() private userDAO: UserDAO;
    @Inject() private secureDAO: SecureDAO;

    constructor() {};

    public async generateAuthTokens(user: IUser): Promise<ITokens> {
        try {
            const accessToken = await this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user);
            return { refreshToken, accessToken };
        } catch (err) {
            throw new HttpError(401, 'Error while generating tokens');
        }
    }

    public async accessTokenIsExpired(token: string): Promise<boolean> {
        try {
            await jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
        } catch (err) {
            return err.name && err.name === 'TokenExpiredError'
        }
        return false;
    }
    
    public async refreshTokenIsExpired(refreshToken: string): Promise<boolean> {
        try {
            const decodedRefreshToken = jwt.decode(refreshToken);
            const users = await this.userDAO.find({find: { id: decodedRefreshToken['payload'].userId}});
            // TODO: change this way
            if (users.length <= 0) {
                throw new HttpError(401, 'User was not found while refreshing tokens');
            }
            const secret = CONSTANTS.REFRESH_TOKEN_SECRET + users[0].password;
            jwt.verify(refreshToken, secret, null);
        } catch (err) {
            return err.name && err.name === 'TokenExpiredError'
        }
        return false;
    }

    public async generateAccessToken(user: IUser): Promise<string> {
        const payload : IPayload = {
            id: user.id,
            username: user.username,
            email: user.email || null,
            phone: user.phone || null
        };
        const accessToken = await jwt.sign({payload}, CONSTANTS.ACCESS_TOKEN_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_EXPIRES_IN }).toString();
        return accessToken;
    }

    public async generateRefreshToken(user: IUser): Promise<string> {
        try {
            const payload = { userId: user.id };
            const refreshSecret = CONSTANTS.REFRESH_TOKEN_SECRET + user.password;
            const refreshToken = await jwt.sign({payload}, refreshSecret, { expiresIn: CONSTANTS.REFRESH_TOKEN_EXPIRES_IN }).toString();
            await this.secureDAO.create({ refreshToken });
            return refreshToken;
        } catch (err) {
            throw new HttpError(404, err.message);
        }
    }

    public async removeRefreshToken(refreshToken: string): Promise<void> {
        try {
            const secures: ISecure[] = await this.secureDAO.find({find: { refreshToken }});
            if (secures && secures.length < 1) {
                throw new HttpError(401, 'Refresh token not found when trying to delete it');
            }
            await this.secureDAO.delete(secures[0].id);
        } catch (err) {
            throw new HttpError(404, err.message);
        }
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
                    reject(new Error('Wrong password'));
                }
            });
        });
    };
}