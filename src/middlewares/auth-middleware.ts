import {ExpressMiddlewareInterface, HeaderParam, Req, Middleware} from "routing-controllers";
import { IUserResponse, UserService } from "../services/user-Service";
import * as jwt from 'jsonwebtoken';
import { UserDAO } from "../models/user-model";
import { Service } from "typedi";
import { request } from "http";

// @Middleware({ type: "before" })
export class Authenticate implements ExpressMiddlewareInterface {
    secret = 'abc123';

    constructor(private userDAO: UserDAO, private userService: UserService) {
        this.userDAO = new UserDAO();
        this.userService = new UserService(userDAO);
    }

    use(@Req() request: any, response: any, next?: (err?: any) => any): any {
        // const token = request.headers['x-auth'];
        this.authenticate(request, response, next);
        next();
    }

    private async authenticate(request: any, response: any, next?: (err?: any) => any): Promise<IUserResponse> {
        const token = request.headers['x-auth'];
        let decoded;
        try {
            decoded = jwt.verify(token, this.secret);
        } catch (err) {
            console.log('err');
            response.status(401).send('You must be authenticated');
        }

        const users = await this.userDAO.find({
            find: {
                'id': decoded._id,
                'tokens.token': token,
                'tokens.access': 'auth'
            }
        });
        const user = users[0];
        if (!user) {
            response.status(401).send('User was not found');
        }
        // response.status(200).send(this.userService.buildUserResponse(user));
        return this.userService.buildUserResponse(user);

    }
 
}