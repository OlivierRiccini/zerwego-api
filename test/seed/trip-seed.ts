const debug = require('debug')('seed');
import mongoose = require('mongoose');
import { TripService}  from '../../src/services/trip-service';
import TRIPS from './trip-seed-data';

export class TripSeed {
    trips = [];

    constructor(private tripService: TripService) {
        this.trips = TRIPS;
    }

    async addTrips() {
        for (const trip of this.trips) {
            this.tripService.createTrip(trip)
                .then(() => debug('Trip test created!'))
                .catch(err => debug('Error during seeding DB test= ' + err));
        }   
    }

    async deleteAllTrips() {
        this.tripService.deleteAllTrips()
            .then(() => debug('Trips test deleted!'))
            .catch(err => debug('Error during seeding DB test= ' + err));   
    }
}