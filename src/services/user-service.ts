const debug = require('debug')('service');
import { Service, Inject } from "typedi";
import { UserDAO } from '../models/user-model';
import * as jwt from 'jsonwebtoken';

@Service()
export class UserService {
    // @Inject() tripDAO: TripDAO;
    constructor(private userDAO: UserDAO) {
        debug('test')
    }

    public async generateAuthToken (user) {
        const access = 'auth';
        const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
        user.tokens.push({access, token});
        const updatedUser = await this.userDAO.update(user, user.id);
        return updatedUser;
    }
    
    public async createUser(req: any) {         
        const response = await this.userDAO.create(req);
        const user = await this.generateAuthToken(response);
        return user;
    }

}