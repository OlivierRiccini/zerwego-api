import { ExpressMiddlewareInterface, HttpError, NotFoundError } from "routing-controllers";
import { UserDAO } from "../models/user-model";
import { TripDAO } from "../models/trip-model";
import * as jwt from 'jsonwebtoken';

export class Authenticate implements ExpressMiddlewareInterface {
    secret = process.env.JWT_SECRET;

    constructor(private userDAO: UserDAO, private tripDAO: TripDAO, private isAdmin: boolean) {
        this.userDAO = new UserDAO();
        this.tripDAO = new TripDAO();
    }  
    
    async use(request: any, response: any, next: (err?: any) => Promise<any>) {
        var token = request.header('x-auth');        
        try {
            if (!token) {
                throw new HttpError(401, 'Only administrator can perform this task');
            }

            const decoded =  jwt.verify(token, this.secret, null);

            if (typeof decoded === 'undefined') {
                throw new HttpError(401, 'Only administrator can perform this task');
            };

           const user = decoded['user'];
           const expirationToken = decoded['ita'];
          
           if (!user) {
                throw new HttpError(401, 'Only administrator can perform this task');
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
            if (Date.now() / 1000 > expirationToken) {
                throw new HttpError(401, 'Token expired');             
            }
        next(); 
        } catch(err) {
            response.status(err.httpCode).send(err);
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
