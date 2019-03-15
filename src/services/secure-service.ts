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

    public async generateAuthTokens(user: IUser, refreshing?: boolean, secureId?: string): Promise<ITokens> {
        try {
            const accessToken = await this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(accessToken, user);
            if (!refreshing) {
                await this.secureDAO.create({refreshToken, _accessToken: accessToken});
            } else {
                await this.secureDAO.update({refreshToken, _accessToken: accessToken}, secureId);
            }
            return { refreshToken, accessToken };
        } catch (err) {
            throw new HttpError(401, 'Error while generating tokens');
        }
    }

    public async refreshTokens(token: string): Promise<string> {
        try {
            const secure = await this.findISecureByAccessToken(token);
            const refreshToken = secure.refreshToken;
            // console.log('refreshToken');
            // console.log(refreshToken);
                
            if (await this.refreshTokenIsExpired(refreshToken)) {
                throw new HttpError(403, 'Refresh token is expired, user has to login');
            } else {
                const decodedRefreshToken = jwt.decode(refreshToken);
                // console.log('decodedRefreshToken');
                // console.log(decodedRefreshToken);
                const userId = jwt.decode(decodedRefreshToken['payload'].accessToken)['payload'].id;
                // console.log('userId');
                // console.log(userId);
                const users = await this.userDAO.find({find: { id: userId}});
                if (users.length <= 0) {
                    throw new HttpError(404, 'User was not found while refreshing tokens');
                }
                const tokens: ITokens= await this.generateAuthTokens(users[0], true, secure.id);
                // await this.secureDAO.update(
                //     {refreshToken: tokens.refreshToken, _accessToken: tokens.accessToken},
                //     secure.id
                // );
                return tokens.accessToken;
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
            // console.log('IN EXIPRED REFRESH TOKEN');
            const decodedRefreshToken = jwt.decode(refreshToken);
            // console.log(decodedRefreshToken);
            const users = await this.userDAO.find({find: { id: decodedRefreshToken['payload'].userId}});
            if (users.length <= 0) {
                throw new HttpError(404, 'User was not found while refreshing tokens');
            }
            const secret = CONSTANTS.REFRESH_TOKEN_SECRET + users[0].password;
            // console.log('IN EXIPRED REFRESH TOKEN - PASSWORD');
            // console.log(users[0].password);
            jwt.verify(refreshToken, secret, null);
        } catch (err) {
            // console.log('IN EXIPRED REFRESH TOKEN - ERROR');
            // console.log(err);
            return err.name && err.name === 'TokenExpiredError'
        }
        return false;
    }

    private async findISecureByAccessToken(accessToken: string): Promise<ISecure> {
        console.log('accessToken');
        console.log(accessToken);
        const results = await this.secureDAO.find({find:{_accessToken: accessToken}});
        console.log('RESULTS');
        console.log(results);
        return results.length > 0 ? results[0] : null;
    }

    private async generateAccessToken(user: IUser): Promise<string> {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        return await jwt.sign({payload}, CONSTANTS.ACCESS_TOKEN_SECRET, { expiresIn: '10s' }).toString();
    }

    private async generateRefreshToken(accessToken: string, user: IUser): Promise<string> {
        const payload = { accessToken, userId: user.id };
        const refreshSecret = CONSTANTS.REFRESH_TOKEN_SECRET + user.password;
        const refreshToken = await jwt.sign({payload}, refreshSecret, { expiresIn: '30s' }).toString();
        return refreshToken;
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