import { ExpressMiddlewareInterface } from "routing-controllers";
import { UserDAO } from "../models/user-model";
import { TripDAO } from "../models/trip-model";

export class Authenticate implements ExpressMiddlewareInterface {

    constructor(private userDAO: UserDAO, private tripDAO: TripDAO, private isAdmin: boolean) {
        this.userDAO = new UserDAO();
        this.tripDAO = new TripDAO();
        // this.isAdmin = isAdmin;
    }  
    
    async use(request: any, response: any, next: (err?: any) => Promise<any>): Promise<any> {
        await this.authenticate(request, response, next);
    }

    private authenticate(request: any, response: any, next?: Function) {
        var token = request.header('x-auth');
        this.userDAO.findByToken(token).then( async (user) => {
            if (!user) {
                response.status(401).send('User was not found');
                return;
            };
            // console.log('ABLLAAAAAa ' + request + this.isAdmin);
            if (request.url.includes('/trips') && this.isAdmin) {
                // console.log(user);
                const isAdminOfThisTrip: boolean = await this.isUserTripAdmin(user.id, request.params.id);
                // console.log('ABLLAAAAAa ' + isAdminOfThisTrip);
            };

            if (this.isAdmin && user)
            request.user = user;
            request.token = token;
            next();
        }).catch((e) => {
            response.status(401).send('opopopopo');
            return;
        }); 
    }

    private async isUserTripAdmin(userId: string, tripId: string): Promise<boolean> {
        // console.log('user ' + userId);
        // console.log('trip ' + tripId);
        const result = await this.tripDAO.find({ find: {
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