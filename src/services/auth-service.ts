import { Service, Inject } from "typedi";
import { UserDAO, IUserCredentials, IForgotPassword, IUser } from '../models/user-model';
import { HttpError, BadRequestError } from "routing-controllers";
import { SecureService } from "./secure-service";
import { MessagesService } from "./messages-service";
const generator = require('generate-password');

@Service()
export class AuthService {
    @Inject() private secureService: SecureService;
    @Inject() private userDAO: UserDAO;
    @Inject() private messagesService: MessagesService;
    
    constructor() { }

    public async register(req: any): Promise<any> {         
        try {
            let user = req;
            const nonHashedPassword = user.password;
            user.password = await this.secureService.hashPassword(user);
            user = await this.userDAO.create(req);
            const tokens = await this.secureService.generateAuthTokens(user);
            // await this.messagesService.sendSMS({
            //     phone: '+14383991332',
            //     content: `Welcome: ${user.name.toUpperCase()}! We generated a new password for you: ${nonHashedPassword}`
            // });
            return tokens;
        } catch (err) {
            throw new HttpError(400, 'Smothing went wrong while creating new user');
        }
    };

    public async login(credentials: IUserCredentials): Promise<any> {
        try {
            let users = await this.userDAO.find({find:{email: credentials.email}});
            let user = users[0];
            if (credentials.type === 'password') {
                await this.secureService.comparePassword(credentials.password, user.password);
            }
            const tokens = await this.secureService.generateAuthTokens(user);  
            return tokens;
        } catch (err) {
            throw new HttpError(400, err);
        }
    };

    public async refreshTokens(refreshToken: string, userId: string) {
        try {
            const user: IUser= await this.userDAO.get(userId)
            const refreshTokenIsExpired: boolean = await this.secureService.refreshTokenIsExpired(refreshToken);
            if (refreshTokenIsExpired) {
                // console.log('Refresh token is no longer valid, user has to login');
                throw new HttpError(401, 'Refresh token is no longer valid, user has to login');
            }
            // await this.secureService.removeRefreshToken(refreshToken);
            const tokens = await this.secureService.generateAuthTokens(user);
            return tokens;
        } catch (err) {
            throw new HttpError(err.httpCode, err.message);
        }
    }

    public async forgotPassword(contact: IForgotPassword) {
        try {
            const result = await this.generateNewPassword(contact);
            switch(contact.type) {
                case 'email':
                    await this.messagesService.sendEmail({
                        from: 'info@olivierriccini.com',
                        to: contact.email,
                        subject: 'New Password',
                        content: `Hey ${result.user.username.toUpperCase()}, this is your new password: ${result.newPassword}. You can go to your profile to change it`
                    });
                    break;
                case 'sms':
                await this.messagesService.sendSMS({
                    phone: contact.phone,
                    content: `Hey ${result.user.username.toUpperCase()}, this is your new password: ${result.newPassword}. You can go to your profile to change it`
                });
                    break;
                default:
                    throw new BadRequestError('Something went wrong while reinitilizing password');
            }
        } catch (err) {
            throw err;
        }
    }

    public async handleFacebookLogin(credentials: IUserCredentials): Promise<string> {
        const users = await this.userDAO.find({find:{email: credentials.email}});
        const password = generator.generate({
            length: 10,
            numbers: true
        });
        if (users && users.length < 1) {
            const newUser = {
                username: credentials.username,
                email: credentials.email,
                password,
                facebookId: credentials.facebookId
            };
            return await this.register(newUser);
        }
        let user = users[0];
        if (!user.facebookId) {
            user.facebookId = credentials.facebookId;
            await this.userDAO.update(user, user.id);
        }
        return await this.login(credentials);
    }

    public async logout(refreshToken: string): Promise<void> {
        try {
            await this.secureService.removeRefreshToken(refreshToken);
        } catch (err) {
            throw new HttpError(400, err);
        }
    };

    private async generateNewPassword(contact: IForgotPassword): Promise<{newPassword: string, user: IUser}> {
        const query = contact.type === 'email' ? {email: contact.email} : {phone: contact.phone};
        const users = await this.userDAO.find({find: query});
        if (!users || users.length < 1 || users.length > 1) {
            throw new HttpError(400, 'No user or more than one user found during password reinitilization process')
        }
        const user = users[0];
        const newPassword = generator.generate({
            length: 10,
            numbers: true
        });
        user.password = newPassword;
        user.password = await this.secureService.hashPassword(user);
        await this.userDAO.update(user, user.id);
        return {newPassword, user};
    }
}