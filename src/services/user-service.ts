import { Service, Inject } from "typedi";
import { IUser, UserDAO } from "../models/user-model";
import { AuthService } from "./auth-service";
import { HttpError } from "routing-controllers";

@Service()
export class UserService {
    // @Inject(type => SecureService) private secureService: SecureService;
    @Inject() private userDAO: UserDAO;
    @Inject() private authService: AuthService;
    // @Inject() private messagesService: MessagesService;
    
    constructor() { }

    public async updateUser(user: IUser, userId: string): Promise<IUser> {
        try {
            await this.authService.emailValidation(user.email, userId);
            await this.authService.phoneValidation(user.phone, userId);
            return await this.userDAO.update(user, userId);
        } catch (err) {
            throw new HttpError(400, err.message);
        }
    }

}