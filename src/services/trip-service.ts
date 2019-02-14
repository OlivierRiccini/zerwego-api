const debug = require('debug')('service');
import { Service, Inject } from "typedi";
import { TripDAO, ITrip, TripDocument } from '../models/trip-model';
import { IUser, UserDAO } from "../models/user-model";

@Service()
export class TripService {
    // @Inject() tripDAO: TripDAO;
    constructor(private tripDAO: TripDAO, private userDAO: UserDAO) {
        debug('test')
    }
    
    public async findTrips(token: string){
        const user: IUser = await this.userDAO.findByToken(token);
        return this.tripDAO.find({
            find: {
                userIds: user.id
            }
        });
    }

    public findById(id: string) {
        return this.tripDAO.get(id);
    }

    public createTrip(trip: ITrip) {          
        return this.tripDAO.create(trip);
    }

    public updateTrip(trip: ITrip, id: string) {          
        return this.tripDAO.update(trip, id);
    }

    public deleteTrip(id: string) {          
        return this.tripDAO.delete(id);
    }
}