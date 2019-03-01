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

        // jwt.verify(token, this.secret, null).then(decode => {

        // })
        
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
                    // throw new HttpError(401, 'Only administrator can perform this task');
                };
            }
            request.user = user;
            request.token = token;
        //    if (Date.now() / 1000 > expirationToken) {
        //         return false;
        //     }
        next(); 
        } catch(err) {
            response.status(err.httpCode).send(err);
        }
        
    //    jwt.verify(token, this.secret, null, (err, decoded) => {
    //        if (typeof decoded === 'undefined') {
    //             response.status(403).send('Error while decoded token');
    //             return;
    //        };

    //        const user = decoded['user'];
    //        const expirationToken = decoded['ita'];
    //        if (err) {
    //             response.status(403).send(err);
    //             return; 
    //        }
    //        if (!user) {
    //             response.status(403).send('User not auth');
    //             return; 
    //        };

    //        if (request.url.includes('/trips') && this.isAdmin) {
    //             const tripId: string = request.params.id;
    //             this.isUserTripAdmin(user.id, tripId).then(
    //                 isTripAdmin => {
    //                     if (isTripAdmin) { 
    //                         response.status(401).send('Only administrator can perform this task');
    //                         return;               
    //                         // throw new HttpError(401, 'Only administrator can perform this task');
    //                     };
    //                 }
    //             )
    //         }
    //         request.user = user;
    //         request.token = token;
    //     //    if (Date.now() / 1000 > expirationToken) {
    //     //         return false;
    //     //     }    
    // });
    // next();
        
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
