import { ExpressMiddlewareInterface } from "routing-controllers";
import { UserDAO } from "../models/user-model";

export class Authenticate implements ExpressMiddlewareInterface {

    constructor(private userDAO: UserDAO) {
        this.userDAO = new UserDAO();
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