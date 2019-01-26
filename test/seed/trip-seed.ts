const debug = require('debug')('seed');
import TRIPS from './trip-data';
import { TripDAO, ITrip } from '../../src/models/trip-model';

export class TripSeed {
    trips: ITrip[] = [];

    constructor(private tripDAO: TripDAO) {
        this.trips = TRIPS;
    }

    async addTrips() {
        for (const trip of this.trips) {
            this.tripDAO.create(trip)
                .then(() => {})
                .catch(err => debug('Error during seeding DB test= ' + err));
        }   
    }

    async deleteAllTrips() {
        this.tripDAO.deleteAll()
            .then(() => {})
            .catch(err => debug('Error during seeding DB test= ' + err));   
    }
}