import { ExpressMiddlewareInterface, HttpError, NotFoundError } from "routing-controllers";
import { UserDAO } from "../models/user-model";
import { TripDAO, ITrip } from "../models/trip-model";
import * as jwt from 'jsonwebtoken';
import { Service, Inject } from "typedi";
import { CONSTANTS } from '../persist/constants'
import { SecureService } from "../services/secure-service";
import { SecureDAO } from "../models/secure-model";

@Service()
export class Authenticate implements ExpressMiddlewareInterface {
    @Inject() private secureService: SecureService;
    @Inject() private tripDAO: TripDAO;

    private isAdmin: boolean;

    constructor(isAdmin: boolean) {
        this.isAdmin = isAdmin;
    }  
    
    async use(request: any, response: any, next: (err?: any) => Promise<any>) {
        let accessToken = request.header('Authorization');  
        // let refreshToken = request.header('Refresh_token');  
        try {
            if (!accessToken) {
                throw new HttpError(401, 'No authorization token provided');
            }

            if (accessToken.startsWith('Bearer ')) {
                // Remove Bearer from string
                accessToken = accessToken.slice(7, accessToken.length);
            }   

            if (accessToken && await this.secureService.accessTokenIsExpired(accessToken)) {
                accessToken = await this.secureService.refreshTokens(accessToken);
                // refreshToken = tokens.refreshToken;
                response.set('Access-Control-Expose-Headers', '*');
                response.set('Authorization', accessToken);
            }

            const decoded = jwt.verify(accessToken, CONSTANTS.ACCESS_TOKEN_SECRET, null);

            if (typeof decoded === 'undefined') {
                throw new HttpError(401, 'Authorizationt token cannot be decoded');
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
            request.token = accessToken;
            next(); 
        } catch(err) {
            response.status(err.httpCode ? err.httpCode : 401).send(err)
        }

    }

    private async isUserTripAdmin(userId: string, tripId: string): Promise<boolean> {
        try {
            const trip: ITrip = await this.tripDAO.get(tripId);
            if (!trip) {
                return false;
            }
            const admin = trip.participants.find(user => user.userId === userId);
            if (!admin) {
                return false;
            }
            if (admin && admin.status === 'admin') {
                return true;
            }
            return false;
        } catch (err) {
            throw new HttpError(401, 'User not found during trip admin checking'); 
        }
    }

}

// @Middleware()
export class AdminOnly extends Authenticate implements ExpressMiddlewareInterface {
    constructor() {
        super(true);
    }
}
