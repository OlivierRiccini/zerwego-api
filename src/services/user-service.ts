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

        // user.tokens.concat([{access, token}]);
        user.tokens.push({access, token});
        const updatedUser = await this.userDAO.update(user, user.id);
        return updatedUser;
        // user.save().then(() => {
        //     return token;
        // });
    }
    
    public async createUser(req: any) {         
        // this.userDAO.create(req).then((user) => {
        //     const 
        //     return user.generateAuthToken();
        // }).then(token => {
        //     return token;
        // })
        const response = await this.userDAO.create(req);
        const user = await this.generateAuthToken(response);
        // const user = await this.userDAO.get(response.id);
        // const token = await this.generateAuthToken(user);
        return user;
    }

}