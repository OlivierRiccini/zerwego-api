import {ExpressMiddlewareInterface, HeaderParam, Req, Middleware, Res} from "routing-controllers";
import { UserService } from "../services/user-Service";
import { UserDAO } from "../models/user-model";

export class Authenticate implements ExpressMiddlewareInterface {
    secret = 'abc123';

    constructor(private userDAO: UserDAO, private userService: UserService) {
        this.userDAO = new UserDAO();
        this.userService = new UserService(userDAO);
    }

    async use(request: any, response: any, next: (err?: any) => Promise<any>): Promise<any> {
        await this.authenticate(request, response, next);
    }

    private authenticate(request: any, response: any, next?: Function) {
        var token = request.header('x-auth');
        this.userDAO.findByToken(token).then((user) => {
            if (!user) {
                response.status(401).send('User was not found');
                return;
            };
            request.user = user;
            request.token = token;
            next();
        }).catch((e) => {
            response.status(401).send('opopopopo');
            return;
        }); 
    }
}