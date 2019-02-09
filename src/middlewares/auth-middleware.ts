import {ExpressMiddlewareInterface, HeaderParam, Req, Middleware, Res} from "routing-controllers";
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

    use(@Req() request: any, @Res() response: any, next?: (err?: any) => any): any {
        // const token = request.headers['x-auth'];
        // this.authenticate(request, response, next);
        var token = request.header('x-auth');

        this.userDAO.findByToken(token).then((user) => {
            if (!user) {
                // throw new Error('User was not found');
                // response.status(401).send('User was not found');
                return Promise.reject();
            }
            console.log(user);
            request.user = user;
            request.token = token;
            next();
        }).catch((e) => {
            // throw new Error(e);
            response.status(401).send(e);
        });
        next();
    }

    private async authenticate(request: any, response: any, next?: (err?: any) => any): Promise<any> {
        var token = request.header('x-auth');

        this.userDAO.findByToken(token).then((user) => {
            if (!user) {
                // throw new Error('User was not found');
                // response.status(401).send('User was not found');
                return Promise.reject();
            }
            request.user = user;
            request.token = token;
            next();
        }).catch((e) => {
            // throw new Error(e);
            response.status(401).send(e);
        });
    }
 
}