import { ExpressMiddlewareInterface, HttpError, NotFoundError } from "routing-controllers";
import { UserDAO } from "../models/user-model";
import { TripDAO } from "../models/trip-model";

export class Authenticate implements ExpressMiddlewareInterface {

    constructor(private userDAO: UserDAO, private tripDAO: TripDAO, private isAdmin: boolean) {
        this.userDAO = new UserDAO();
        this.tripDAO = new TripDAO();
    }  
    
    use(request: any, response: any, next: (err?: any) => Promise<any>) {
        var token = request.header('x-auth');
        this.userDAO.findByToken(token).then( async (user) => {
            if (!user) {
                throw new NotFoundError('User not authenticated');
            };

            if (request.url.includes('/trips')) {
                const tripId: string = request.params.id;
                if (this.isAdmin && !(await this.isUserTripAdmin(user.id, tripId))) {               
                    throw new HttpError(401, 'Only administrator can perform this task');
                };
            }

            request.user = user;
            request.token = token;
            next();
        }).catch((err) => {
            response.status(err.httpCode).send(err);
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
