const debug = require('debug')('service');
import { Service, Inject } from "typedi";
import { TripDAO, ITrip, IWaitingUser } from '../models/trip-model';
import { IUser, UserDAO } from "../models/user-model";
import _ = require("lodash");

@Service()
export class TripService {
    @Inject() private tripDAO: TripDAO;
    @Inject() private userDAO: UserDAO;

    constructor() { }
    
    public async findTrips(userId: string){
        return this.tripDAO.find({
            find: {
                userIds: userId
            }
        });
    }

    public findById(id: string) {
        return this.tripDAO.get(id);
    }

    public async createTrip(trip: ITrip) {
        try {
            // Check if user exists, if not send email or facebook notif or whatsapp notif or text notif
            await this.handleUsers(trip);
            return await this.tripDAO.create(trip);
        } catch (err) {
            console.log(err);
        }
    }

    public updateTrip(trip: ITrip, id: string) {          
        return this.tripDAO.update(trip, id);
    }

    public deleteTrip(id: string) {          
        return this.tripDAO.delete(id);
    }

    private async handleUsers(trip: ITrip): Promise<void> {
        const emails: string[] = trip.waitingUsers.map(obj => { return obj.email });
        
        const exitingUsers: any[] = await this.userDAO.find({find: {'email': { $in: emails }}});

        if (exitingUsers.length > 0) {
            trip.userIds = exitingUsers.map(user => { return user.id });
            for (const user of exitingUsers) {
                const i: number = trip.waitingUsers.findIndex(watinUser => watinUser.email === user.email);
                if (i >= 0) { trip.waitingUsers.splice(i, 1) }
            }
        }
    }

}