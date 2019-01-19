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
                .then(() => console.log('Trip test created!'))
                .catch(err => console.log('Error during seeding DB test= ' + err));
        }   
    }

    async deleteAllTrips() {
        this.tripService.deleteAllTrips()
            .then(() => console.log('Trips test deleted!'))
            .catch(err => console.log('Error during seeding DB test= ' + err));   
    }
}