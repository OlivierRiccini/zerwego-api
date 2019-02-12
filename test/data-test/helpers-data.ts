const debug = require('debug')('seed');
import TRIPS from './trip-data';
import { TripDAO, ITrip } from '../../src/models/trip-model';
import { UserDAO } from '../../src/models/user-model';

export class TripHelper {
    trips: ITrip[] = [];

    constructor(private tripDAO: TripDAO) {
        this.trips = TRIPS;
    }

    public async addTrips() {
        for (const trip of this.trips) {
            await this.tripDAO.create(trip);
        }   
    }

    public async deleteAllTrips() {
        return this.tripDAO.deleteAll();   
    }
};

export class UserHelper {
    constructor(private userDAO: UserDAO) {
    }

    public async deleteAllUsers() {
        return this.userDAO.deleteAll();  
    }
}