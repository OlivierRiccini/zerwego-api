import mongoose = require('mongoose');
import { ITrip } from '../../src/models/trip-model';
import Trip from '../../src/models/trip-model';
var mongooseConnection = require('../../dist/app').mongooseConnection;

export class TripSeed {
    private trips: any[] = [
        {
            tripName: "Test",
            destination: "Los Angeles, California, United States",
            imageUrl: null,
            startDate: new Date('2019-03-12'),
            endDate: new Date('2019-03-25'),
            adminId: null
        }
    ]
    constructor() {
    }

    public addTrips() {
        mongooseConnection.model('trip').insertMany(this.trips, (error, docs) => {
            console.log(JSON.stringify(docs));
            console.log(error);
        });
    }
}
