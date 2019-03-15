import { Service } from "typedi";
import { UserDAO, IUserCredentials } from '../models/user-model';
import { HttpError } from "routing-controllers";
import { SecureService } from "./secure-service";

@Service()
export class AuthService {

    constructor(private secureService: SecureService, private userDAO: UserDAO) {
    };

    public async register(req: any): Promise<string> {         
        try {
            let user = req;
            user.password = await this.secureService.hashPassword(user);
            user = await this.userDAO.create(req);
            const tokens = await this.secureService.generateAuthTokens(user);
            // const token = await this.secureService.generateAuthToken(user)
            return tokens.accessToken;
        } catch (err) {
            throw new HttpError(400, 'Smothing went wrong while creating new user');
        }
    };

    public async login(credentials: IUserCredentials): Promise<string> {
        try {
            let users = await this.userDAO.find({find:{email: credentials.email}});
            let user = users[0];
            await this.secureService.comparePassword(credentials.password, user.password);
            const tokens = await this.secureService.generateAuthTokens(user);
            // const token = await this.secureService.generateAuthToken(user);
            return tokens.accessToken;
        } catch (err) {
            throw new HttpError(400, err);
        }
    };
}