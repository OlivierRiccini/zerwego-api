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
    
    use(request: any, response: any, next: (err?: any) => Promise<any>) {
        var token = request.header('x-auth');
        // this.userDAO.findByToken(token).then( async (user) => {
        //     if (!user) {
        //         throw new NotFoundError('User not authenticated');
        //     };

        //     if (request.url.includes('/trips')) {
        //         const tripId: string = request.params.id;
        //         if (this.isAdmin && !(await this.isUserTripAdmin(user.id, tripId))) {               
        //             throw new HttpError(401, 'Only administrator can perform this task');
        //         };
        //     }

        //     request.user = user;
        //     request.token = token;
        //     next();
        // }).catch((err) => {
        //     response.status(err.httpCode).send(err);
        // });
        // });
        // try {
        //     const decoded = await jwt.verify(token, this.secret, null);
        //     console.log(decoded);
        // } catch (err) {
        //     response.status(err.httpCode).send(err);
        // }
       jwt.verify(token, this.secret, null, (err, decoded) => {
           const user = decoded['user'];
           if (err) {
                response.status(403).send(err);
           }
           if (request.url.includes('/trips') && this.isAdmin) {
            const tripId: string = request.params.id;
                this.isUserTripAdmin(user.id, tripId).then(
                    isTripAdmin => {
                        if (isTripAdmin) {               
                            throw new HttpError(401, 'Only administrator can perform this task');
                        };
                    }
                )
            }
            request.user = user;
            request.token = token;
        //    if (Date.now() / 1000 > exp) {
        //     return false;
        //     }    
           next();
       });
        
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
