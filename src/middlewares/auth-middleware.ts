import { ExpressMiddlewareInterface, HttpError, NotFoundError } from "routing-controllers";
import { UserDAO } from "../models/user-model";
import { TripDAO } from "../models/trip-model";
import * as jwt from 'jsonwebtoken';
import { Service } from "typedi";
import { CONSTANTS } from '../persist/constants'

@Service()
export class Authenticate implements ExpressMiddlewareInterface {

    constructor(private userDAO: UserDAO, private tripDAO: TripDAO, private isAdmin: boolean) {
    }  
    
    async use(request: any, response: any, next: (err?: any) => Promise<any>) {
        let token = request.header('Authorization');        
        try {
            if (!token) {
                throw new HttpError(401, 'No authorization token provided');
            }

            if (token.startsWith('Bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
            }

            const decoded = jwt.verify(token, CONSTANTS.JWT_SECRET, null);

            if (typeof decoded === 'undefined') {
                throw new HttpError(401, 'Authorizationt oken cannot be decoded');
            };

           const user = decoded['payload'];
          
           if (!user) {
                throw new HttpError(401, 'This token is not related to any user');
           };

           if (request.url.includes('/trips') && this.isAdmin) {
                const tripId: string = request.params.id;
                const isTripAdmin = await this.isUserTripAdmin(user.id, tripId);
                if (!isTripAdmin) { 
                    throw new HttpError(401, 'Only administrator can perform this task');             
                };
            }
            request.user = user;
            request.token = token;
            next(); 
        } catch(err) {
            response.status(err.httpCode ? err.httpCode : 401).send(err)
        }

    }

    private async isUserTripAdmin(userId: string, tripId: string): Promise<boolean> {
        const result = await this.tripDAO.find({find: {
            id: tripId,
            adminId: userId
        }});
        return result.length > 0;
    }

}

// @Middleware()
export class AdminOnly extends Authenticate implements ExpressMiddlewareInterface {
    constructor() {
        super(new UserDAO(), new TripDAO(), true);
    }
}
