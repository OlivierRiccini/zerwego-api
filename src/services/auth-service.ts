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

    public async register(req: any): Promise<string> {         
        try {
            let user = req;
            const nonHashedPassword = user.password;
            user.password = await this.secureService.hashPassword(user);
            user = await this.userDAO.create(req);
            const tokens = await this.secureService.generateAuthTokens(user);
            await this.messagesService.sendSMS({
                phone: '+14383991332',
                content: `Welcome: ${user.name.toUpperCase()}! We generated a new password for you: ${nonHashedPassword}`
            });
            return tokens.accessToken;
        } catch (err) {
            throw new HttpError(400, 'Smothing went wrong while creating new user');
        }
    };

    public async login(credentials: IUserCredentials): Promise<string> {
        try {
            let users = await this.userDAO.find({find:{email: credentials.email}});
            let user = users[0];
            if (credentials.type === 'password') {
                await this.secureService.comparePassword(credentials.password, user.password);
            }

            // TODO; Maybe verify facebook token
            const tokens = await this.secureService.generateAuthTokens(user);
            // await this.messagesService.sendEmail({
            //         from: 'info@olivierriccini.com',
            //         subject: 'Welcome to Zerwego',
            //         to: user.email,
            //         content: `Welcome: ${user.name.toUpperCase()}!`
            //     });

            // await this.messagesService.sendSMS({
            //     phone: '+14383991332',
            //     content: `Welcome: ${user.name.toUpperCase()}!`
            // });

            return tokens.accessToken;
        } catch (err) {
            throw new HttpError(400, err);
        }
    };

    public async forgotPassword(contact: IForgotPassword) {
        try {
            console.log('------------ 2 -----------');
            const result = await this.generateNewPassword(contact);
            console.log('------------ 3 -----------');
            switch(contact.type) {
                case 'email':
                    await this.messagesService.sendEmail({
                        from: 'info@olivierriccini.com',
                        to: contact.email,
                        subject: 'New Password',
                        content: `Hey ${result.user.name.toUpperCase()}, this is your new password: ${result.newPassword}. You can go to your profile to change it`
                    });
                    break;
                case 'sms':
                console.log('------------ 4 -----------');
                await this.messagesService.sendSMS({
                    phone: contact.phone,
                    content: `Hey ${result.user.name.toUpperCase()}, this is your new password: ${result.newPassword}. You can go to your profile to change it`
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
                name: credentials.name,
                email: credentials.email,
                password,
                facebookId: credentials.facebookId
            };
            return await this.register(newUser);
        }
        let user = users[0];
        user.facebookId = credentials.facebookId;
        await this.userDAO.update(user, user.id);
        return await this.login(credentials);
    }

    public async logout(token: string): Promise<void> {
        try {
            await this.secureService.removeSecure(token);
        } catch (err) {
            throw new HttpError(400, err);
        }
    };

    private async generateNewPassword(contact: IForgotPassword): Promise<{newPassword: string, user: IUser}> {
        const query = contact.type === 'email' ? {email: contact.email} : {phone: contact.phone};
        const users = await this.userDAO.find({find:query});
        if (!users || users.length < 1) {
            throw new HttpError(400, 'No user was found during password reinitilization process')
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