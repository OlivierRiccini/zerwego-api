import { Service, Inject } from "typedi";
import { UserDAO, IUserCredentials, IForgotPassword, IUser } from '../models/user-model';
import { HttpError, BadRequestError } from "routing-controllers";
import { SecureService } from "./secure-service";
import { MessagesService } from "./messages-service";
import validator from 'validator';
const generator = require('generate-password');

@Service()
export class AuthService {
    @Inject(type => SecureService) private secureService: SecureService;
    @Inject() private userDAO: UserDAO;
    @Inject() private messagesService: MessagesService;
    
    constructor() { }

    public async register(req: any): Promise<any> {         
        try {
            let user = req;
            // const nonHashedPassword = user.password;
            user.password = await this.secureService.hashPassword(user);
            if (user.email) { await this.emailValidation(user.email) };
            if (user.phone) { await this.phoneValidation(user.phone) };
            user = await this.userDAO.create(req);
            const tokens = await this.secureService.generateAuthTokens(user);
            // await this.messagesService.sendSMS({
            //     phone: '+14383991332',
            //     content: `Welcome: ${user.name.toUpperCase()}! We generated a new password for you: ${nonHashedPassword}`
            // });
            return tokens;
        } catch (err) {
            throw new HttpError(400, err.message);
        }
    };

    public async login(credentials: IUserCredentials): Promise<any> {
        try {
            this.validateLoginType(credentials);
            const emailOrPhone: 'email' | 'phone' = this.defineEmailOrPhone(credentials);
            this.validateProvidedCredentials(credentials);
            const query = emailOrPhone === 'email' ? {find:{email: credentials.email}} : {find:{phone: credentials.phone}};
            let users = await this.userDAO.find(query);
            if (!users || users.length <= 0) {
                throw new Error('User was not found while login');
            }
            let user = users[0];
            if (credentials.type === 'password') {
                await this.secureService.comparePassword(credentials.password, user.password);
            }
            const tokens = await this.secureService.generateAuthTokens(user);  
            return tokens;
        } catch (err) {
            throw new HttpError(400, err.message);
        }
    };

    public async refreshTokens(refreshToken: string, userId: string) {
        try {
            const user: IUser= await this.userDAO.get(userId);
            await this.secureService.validateRefreshToken(refreshToken);
            const tokens = await this.secureService.generateAuthTokens(user);
            return tokens;
        } catch (err) {
            throw new HttpError(401, err.message);
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

    public async isEmailAlreadyTaken(email: string): Promise<boolean> {
        const users: IUser[] = await this.userDAO.find({find: { email }});
        return users.length > 0;
    }

    public async isPhoneAlreadyTaken(phone: string): Promise<boolean> {
        const users: IUser[] = await this.userDAO.find({find: { phone }});
        return users.length > 0;
    }

    public defineEmailOrPhone(credentials: IUserCredentials): 'email' | 'phone' {
        if (this.credentialsHadEmail(credentials)) {
            return 'email'
        }
        if (!this.credentialsHadEmail(credentials) && this.credentialsHasPhone(credentials)) {
            return 'phone'
        }
        if (!this.credentialsHadEmail(credentials) && !this.credentialsHasPhone(credentials)) {
            throw new HttpError(400, 'User credentials should at least contain an email or a phone property');
        }
    }

    private async emailValidation(email: string): Promise<void> {  
        if (await this.isEmailAlreadyTaken(email)) {
            throw new Error('Email address already belongs to an account');
        }
        if (!validator.isEmail(email)) {
            throw new Error('Email address provided is not valid');
        }
    }

    private async phoneValidation(phone: string): Promise<void> {  
        if (await this.isPhoneAlreadyTaken(phone)) {
            throw new Error('Phone number already belongs to an account');
        }
        if (!validator.isMobilePhone(phone, 'any', {strictMode: true})) {
            throw new Error('Phone number provided is not valid');
        }
    }

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

    private validateProvidedCredentials(credentials: IUserCredentials): void {
        if (this.credentialsHadEmail(credentials) && !validator.isEmail(credentials.email)) {
            throw new Error('Provided email is not valid');
        }
        if (this.credentialsHasPhone(credentials)
            && !validator.isMobilePhone(credentials.phone, 'any', {strictMode: true})) {
            throw new Error('Provided phone number is not valid');
        }
    }

    private credentialsHadEmail(credentials: IUserCredentials): boolean {
        return credentials.hasOwnProperty('email') && !!credentials.email;
    }

    private credentialsHasPhone(credentials: IUserCredentials): boolean {
        return credentials.hasOwnProperty('phone') && !!credentials.phone;
    }

    private validateLoginType(credentials: IUserCredentials): void {
        if (!credentials.hasOwnProperty('type') || credentials.type !== 'password' && credentials.type !== 'facebook') {
            throw new Error('Credentials should have a property type equal either \'password\' or \'facebook\'');
        }
    }
}