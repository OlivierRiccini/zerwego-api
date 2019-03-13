import { Service, Inject } from "typedi";
import { IUser, UserDAO} from '../models/user-model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { CONSTANTS } from "../persist/constants";
import { HttpError } from "routing-controllers";
import { SecureDAO, ISecure } from "../models/secure-model";

export interface ITokens { accessToken: string, refreshToken: string };

@Service()
export class SecureService {
    @Inject() private userDAO: UserDAO;

    constructor(private secureDAO: SecureDAO) {};

    public async generateAuthTokens(user: IUser): Promise<ITokens> {
        try {
            // generateAccessToken
            const accessToken = await this.generateAccessToken(user);
            // generateRefreshToken(token)
            const refreshToken = await this.generateRefreshToken(user);
            return { accessToken, refreshToken };
        } catch (err) {
            console.log(err);
            throw new HttpError(401, 'Error while generating tokens');
        }
    }

    public async refreshTokens(refreshToken: string): Promise<ITokens> {
        try {
            const decodedRefreshToken = jwt.decode(refreshToken);
            console.log(refreshToken)
            const users = await this.userDAO.find({find: { id: decodedRefreshToken['payload'].userId}});

            if (users.length <= 0) {
                throw new HttpError(404, 'User was not found while refreshing tokens');
            }
            
            if (await this.refreshTokenIsExpired(refreshToken)) {
                throw new HttpError(403, 'Refresh token is expired, user has to login');
            } else {
               return this.generateAuthTokens(users[0]);
            }
        } catch (err) {
            throw new HttpError(400, err);
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
            if (users.length <= 0) {
                throw new HttpError(404, 'User was not found while refreshing tokens');
            }
            const secret = CONSTANTS.REFRESH_TOKEN_SECRET + users[0].password;
            jwt.verify(refreshToken, secret, null);
        } catch (err) {
            console.log(err);
            return err.name && err.name === 'TokenExpiredError'
        }
        return false;
    }

    private async generateAccessToken(user: IUser): Promise<string> {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        return await jwt.sign({payload}, CONSTANTS.ACCESS_TOKEN_SECRET, { expiresIn: '10s' }).toString();
    }

    private async generateRefreshToken(user: IUser): Promise<string> {
        const payload = { userId: user.id };
        const refreshSecret = CONSTANTS.REFRESH_TOKEN_SECRET + user.password;
        return await jwt.sign({payload}, refreshSecret, { expiresIn: '7d' }).toString();
    }


    // public async generateAuthToken(user: IUser): Promise<any> {
    //     try {
    //         const payload = {
    //             id: user.id,
    //             name: user.name,
    //             email: user.email,
    //         };
    //         const access_token = await jwt.sign({payload}, CONSTANTS.JWT_SECRET, { expiresIn: '10s' }).toString();
            
    //         const refreshToken = await this.findRefreshTokenByTokenOrUserId(user.id, null);
    //         if (!refreshToken) {
    //             await this.generateRefreshToken(user, access_token);
    //         } else {
    //             await this.updateRefreshToken(refreshToken, access_token);
    //         }
    //         return access_token;
    //     } catch (err) {
    //         throw new HttpError(401, err);
    //     }
    // };

    // async generateRefreshToken(user: IUser, _accessToken: string): Promise<void> {
    //     const payload = { user, _accessToken };
    //     const refreshToken = await jwt.sign({payload}, CONSTANTS.JWT_SECRET, { expiresIn: '7d' }).toString();
    //     await this.secureDAO.create({refreshToken, _accessToken, _userId: user.id});
    // }

    // async updateRefreshToken(refreshToken: ISecure, access_token: string) {
    //     try {
    //         console.log('updateRefreshToken');
    //         refreshToken._accessToken = access_token;
    //         await this.secureDAO.update(refreshToken, refreshToken.id);
    //     } catch (err) {
    //         throw new HttpError(400, err);
    //     }
    // }

    // async refreshToken(expiredToken: string) {
    //     try {
    //         console.log('refreshToken');
    //         let refreshToken = await this.findRefreshTokenByTokenOrUserId(expiredToken);
    //         console.log(refreshToken);
    //         if (!refreshToken) {
    //             throw new Error('No refresh token was found for this token');
    //         }
    //         if (this.tokenIsExpired(refreshToken)) {
    //             await this.secureDAO.delete(refreshToken.id);
    //             throw new Error('Refresh token is exipred, user has to login');
    //         }
    //         const user = refreshToken['payload'].user;
    //         console.log(user);
    //         const newToken = await this.generateAuthToken(user);
    //         return newToken;
    //     } catch (err) {
    //         throw new HttpError(401, err);
    //     }
    // }

    // tokenIsExpired(token): boolean {
    //     try {
    //         jwt.verify(token, CONSTANTS.JWT_SECRET, null)
    //     } catch (err) {
    //         return err.name && err.name === 'TokenExpiredError'
    //     }
    //     return false;
    // }

    // async findRefreshTokenByTokenOrUserId(userId?: string, token?: string) {
    //     let tokens: ISecure[];
    //     if (token) {
    //         tokens = await this.secureDAO.find({find:{_accessToken: token}});
    //     } else {
    //         tokens = await this.secureDAO.find({find:{_userId: userId}});
    //     }
    //     return tokens.length <= 0 ? null : tokens[0];
    // }

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